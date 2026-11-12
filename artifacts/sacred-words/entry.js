"use strict";

const errorUtils = globalThis.ErrorUtils;
const isProduction = process.env.NODE_ENV === "production";
const listeners = new Set();
let startupError = null;
const previousErrorHandler =
  typeof errorUtils?.getGlobalHandler === "function"
    ? errorUtils.getGlobalHandler()
    : null;

function formatError(error, isFatal) {
  const message =
    error && typeof error.message === "string"
      ? error.message
      : String(error);
  const stack = error && typeof error.stack === "string" ? error.stack : "";
  return { message, stack, isFatal };
}

function publishStartupError(error, isFatal) {
  startupError = formatError(error, isFatal);
  console.error(
    `[Sacred Words] Uncaught startup error${isFatal ? " (fatal)" : ""}: ${startupError.message}`,
    startupError.stack,
  );
  for (const listener of [...listeners]) {
    try {
      listener();
    } catch (listenerError) {
      console.error("[Sacred Words] Could not notify the startup error screen.", listenerError);
    }
  }
}

if (typeof errorUtils?.setGlobalHandler === "function") {
  errorUtils.setGlobalHandler((error, isFatal) => {
    if (isProduction) {
      // Do not forward fatal errors to React Native's default handler: it
      // aborts the JS runtime before the user can read the diagnostic screen.
      publishStartupError(error, isFatal);
      return;
    }

    if (previousErrorHandler) {
      previousErrorHandler(error, isFatal);
    } else {
      console.error(error);
    }
  });
}

function subscribeToStartupError(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function StartupErrorScreen({ error }) {
  const React = require("react");
  const { ScrollView, StyleSheet, Text, View } = require("react-native");
  const details = [
    `Message:\n${error.message}`,
    `Stack:\n${error.stack || "(no stack available)"}`,
  ].join("\n\n");

  return React.createElement(
    View,
    { style: styles.screen },
    React.createElement(Text, { style: styles.title }, "Sacred Words could not start"),
    React.createElement(
      Text,
      { style: styles.hint },
      "Please share this error text with support.",
    ),
    React.createElement(
      ScrollView,
      { style: styles.details, contentContainerStyle: styles.detailsContent },
      React.createElement(Text, { selectable: true, style: styles.errorText }, details),
    ),
  );
}

const styles = {
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 24,
  },
  title: {
    color: "#181818",
    fontSize: 21,
    fontWeight: "600",
    marginBottom: 8,
  },
  hint: {
    color: "#444444",
    fontSize: 15,
    marginBottom: 16,
  },
  details: {
    flex: 1,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 8,
  },
  detailsContent: {
    padding: 12,
  },
  errorText: {
    color: "#222222",
    fontFamily: "Courier",
    fontSize: 12,
    lineHeight: 18,
  },
};

class StartupErrorBoundary extends require("react").Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error: formatError(error, true) };
  }

  componentDidCatch(error) {
    publishStartupError(error, true);
  }

  render() {
    const error = this.state.error || startupError;
    if (isProduction && error) {
      return require("react").createElement(StartupErrorScreen, { error });
    }
    return this.props.children;
  }
}

function installRootErrorScreen() {
  const expo = require("expo");
  const registerRootComponent = expo.registerRootComponent;
  if (typeof registerRootComponent !== "function") {
    throw new Error("Expo registerRootComponent is unavailable.");
  }

  expo.registerRootComponent = (RootComponent) => {
    function GuardedRoot(props) {
      const React = require("react");
      const capturedError = React.useSyncExternalStore(
        subscribeToStartupError,
        () => startupError,
        () => startupError,
      );

      if (isProduction && capturedError) {
        return React.createElement(StartupErrorScreen, { error: capturedError });
      }

      return React.createElement(
        StartupErrorBoundary,
        null,
        React.createElement(RootComponent, props),
      );
    }

    return registerRootComponent(GuardedRoot);
  };
}

try {
  installRootErrorScreen();
  require("expo-router/entry");
} catch (error) {
  publishStartupError(error, true);
  try {
    const expo = require("expo");
    expo.registerRootComponent(() =>
      require("react").createElement(StartupErrorScreen, { error: startupError }),
    );
  } catch (registrationError) {
    console.error("[Sacred Words] Could not register the startup error screen.", registrationError);
  }
}
