import { ClerkProvider, ClerkLoaded } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import React, { useEffect } from "react";
import type { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

export function ClerkRoot({ children }: PropsWithChildren) {
  const c = useColors();
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
  const missingPublishableKey = !publishableKey;

  useEffect(() => {
    if (missingPublishableKey) {
      console.error(
        "[Sacred Words] Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Clerk was not started.",
      );
    }
  }, [missingPublishableKey]);

  if (missingPublishableKey) {
    return (
      <View style={[styles.errorScreen, { backgroundColor: c.cream }]}>
        <Text style={[styles.errorTitle, { color: c.warmBrown }]}>
          Sign-in is unavailable
        </Text>
        <Text
          accessibilityRole="alert"
          style={[styles.errorMessage, { color: c.muted }]}
        >
          Sacred Words couldn’t load its sign-in settings. Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
      proxyUrl={process.env.EXPO_PUBLIC_CLERK_PROXY_URL || undefined}
    >
      <ClerkLoaded>{children}</ClerkLoaded>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  errorScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    gap: 12,
  },
  errorTitle: {
    fontFamily: "PlayfairDisplay_600SemiBold",
    fontSize: 24,
    textAlign: "center",
  },
  errorMessage: {
    fontFamily: "Lato_400Regular",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
});
