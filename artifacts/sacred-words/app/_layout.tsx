import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_600SemiBold,
} from "@expo-google-fonts/playfair-display";
import {
  Lato_300Light,
  Lato_400Regular,
  Lato_700Bold,
} from "@expo-google-fonts/lato";
import { useFonts } from "expo-font";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { setBaseUrl, setAuthTokenGetter, getBrowsePrayers } from "@workspace/api-client-react";
import { useAuth } from "@/lib/clerkHooks";
import { ClerkRoot } from "@/lib/ClerkRoot";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "@/constants/colors";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { initializeRevenueCat, SubscriptionProvider } from "@/lib/revenuecat";
import { ThemeProvider, useTheme } from "@/lib/theme";
import {
  requestNotificationPermission,
  getNotificationPreferences,
  scheduleDailyNotifications,
  needsReschedule,
  type PrayerTeaserItem,
} from "@/lib/notifications";

try {
  const apiDomain = process.env.EXPO_PUBLIC_DOMAIN?.trim();
  if (Platform.OS !== "web" && apiDomain) {
    const normalizedDomain = apiDomain
      .replace(/^https?:\/\//i, "")
      .split(/[/?#]/, 1)[0];
    if (!normalizedDomain || /\s/.test(normalizedDomain)) {
      throw new Error("EXPO_PUBLIC_DOMAIN is not a valid host.");
    }
    if (/^http:\/\//i.test(apiDomain) && process.env.NODE_ENV === "production") {
      throw new Error("The production API URL must use HTTPS.");
    }
    setBaseUrl(`https://${normalizedDomain}`);
  } else if (Platform.OS !== "web") {
    console.error(
      "[Sacred Words] EXPO_PUBLIC_DOMAIN is missing; API requests may not work.",
    );
  }
} catch (error) {
  console.error("[Sacred Words] Could not configure the API base URL.", error);
}

try {
  initializeRevenueCat();
} catch {
  // RevenueCat not configured — subscription features will be unavailable
}

try {
  SplashScreen.preventAutoHideAsync().catch((error) => {
    console.warn("[Sacred Words] Could not keep the splash screen visible.", error);
  });
} catch (error) {
  console.warn("[Sacred Words] Could not keep the splash screen visible.", error);
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const PROMPT_KEY = "sacred_words_notification_prompt_shown";
const LAST_HANDLED_NOTIFICATION_KEY = "sacred_words_last_handled_notification_id";

async function fetchPrayerTeasers(): Promise<PrayerTeaserItem[]> {
  try {
    const json = await getBrowsePrayers();
    return json.prayers.map((p) => ({ id: p.id, title: p.title }));
  } catch {
    return [];
  }
}

function ClerkApiSession() {
  const { getToken, userId, isLoaded } = useAuth();
  const previousId = useRef<string | null | undefined>(undefined);
  // Register synchronously before descendants can issue their first query.
  // Expo web uses same-origin cookies, never explicit bearer tokens.
  if (Platform.OS !== "web") setAuthTokenGetter(() => getToken());
  useEffect(() => {
    if (!isLoaded) return;
    if (previousId.current !== undefined && previousId.current !== userId) queryClient.clear();
    previousId.current = userId;
  }, [isLoaded, userId]);
  return null;
}

function navigateToPrayer(
  router: ReturnType<typeof useRouter>,
  data: { prayerId?: number } | undefined
) {
  if (data?.prayerId) {
    router.push(`/(tabs)/browse?prayerId=${data.prayerId}`);
  } else {
    router.push("/(tabs)/browse");
  }
}

function FirstLaunchPrompt({
  visible,
  onGoToSettings,
  onDismiss,
}: {
  visible: boolean;
  onGoToSettings: () => void;
  onDismiss: () => void;
}) {
  const { resolvedScheme } = useTheme();
  const c = resolvedScheme === "dark" ? colors.dark : colors.light;
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={false}
      onRequestClose={onDismiss}
    >
      <View style={[promptStyles.root, { backgroundColor: c.cream }]}>
        <View style={[promptStyles.handle, { backgroundColor: c.border }]} />

        <View style={promptStyles.body}>
          <Text style={[promptStyles.emoji]}>🕯️</Text>
          <Text style={[promptStyles.title, { color: c.warmBrown, fontFamily: "PlayfairDisplay_600SemiBold" }]}>
            A daily moment of prayer
          </Text>
          <Text style={[promptStyles.subtitle, { color: c.muted, fontFamily: "Lato_400Regular" }]}>
            Would you like a gentle daily reminder — a community prayer delivered each morning, midday, or evening?
          </Text>
        </View>

        <View style={promptStyles.actions}>
          <Pressable
            onPress={onGoToSettings}
            accessibilityRole="button"
            accessibilityLabel="Set up daily reminder"
            style={[promptStyles.primaryBtn, { backgroundColor: c.gold }]}
          >
            <Text style={[promptStyles.primaryBtnText, { fontFamily: "Lato_700Bold" }]}>
              Set Up Reminder
            </Text>
          </Pressable>
          <Pressable
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="Maybe later"
            style={promptStyles.secondaryBtn}
          >
            <Text style={[promptStyles.secondaryBtnText, { color: c.muted, fontFamily: "Lato_400Regular" }]}>
              Maybe later
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const promptStyles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 32,
  },
  body: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  emoji: { fontSize: 52, lineHeight: 60 },
  title: { fontSize: 26, lineHeight: 34, textAlign: "center" },
  subtitle: { fontSize: 17, lineHeight: 28, textAlign: "center", maxWidth: 300 },
  actions: { width: "100%", gap: 12 },
  primaryBtn: {
    height: 54,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 17 },
  secondaryBtn: { alignItems: "center", paddingVertical: 10 },
  secondaryBtnText: { fontSize: 16 },
});

function RootLayoutNav() {
  const router = useRouter();
  const { resolvedScheme } = useTheme();
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (Platform.OS === "web") return;

    // ── Cold-start: app launched by tapping a notification from killed state ──
    // getLastNotificationResponseAsync() returns the response that caused the
    // app to launch, covering what addNotificationResponseReceivedListener
    // cannot catch in the terminated-state path. We compare the notification
    // identifier against a stored value so stale responses from prior sessions
    // don't trigger re-navigation on later launches.
    Notifications.getLastNotificationResponseAsync().then(async (lastResponse) => {
      if (!lastResponse) return;
      const notifId = lastResponse.notification.request.identifier;
      const alreadyHandled = await AsyncStorage.getItem(LAST_HANDLED_NOTIFICATION_KEY);
      if (alreadyHandled === notifId) return; // already routed in a previous launch
      await AsyncStorage.setItem(LAST_HANDLED_NOTIFICATION_KEY, notifId);
      const data = lastResponse.notification.request.content.data as
        | { prayerId?: number }
        | undefined;
      navigateToPrayer(router, data);
    }).catch((error) => {
      console.warn("[Sacred Words] Could not read the launch notification.", error);
    });

    // ── Foreground / background tap listener ──
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as
          | { prayerId?: number }
          | undefined;
        navigateToPrayer(router, data);
      }
    );

    // ── Refresh notification queue when running low ──
    (async () => {
      try {
        const prefs = await getNotificationPreferences();
        if (prefs.time !== "off") {
          const granted = await requestNotificationPermission();
          if (granted && (await needsReschedule())) {
            const prayers = await fetchPrayerTeasers();
            await scheduleDailyNotifications(prefs.time, prayers);
          }
        }
      } catch {
        // Silently ignore — notifications are non-critical
      }
    })();

    // ── First-launch opt-in prompt ──
    // Show once when the user has never configured or dismissed a reminder.
    (async () => {
      try {
        const alreadyShown = await AsyncStorage.getItem(PROMPT_KEY);
        if (alreadyShown) return;
        const prefs = await getNotificationPreferences();
        if (prefs.time !== "off") return; // already configured — skip
        setShowPrompt(true);
      } catch {
        // Ignore — prompt is a nice-to-have
      }
    })();

    return () => {
      responseListener.current?.remove();
    };
  }, [router]);

  const handleGoToSettings = async () => {
    await AsyncStorage.setItem(PROMPT_KEY, "1");
    setShowPrompt(false);
    router.push("/(tabs)/settings");
  };

  const handleDismissPrompt = async () => {
    await AsyncStorage.setItem(PROMPT_KEY, "1");
    setShowPrompt(false);
  };

  return (
    <>
      <StatusBar
        style={resolvedScheme === "dark" ? "light" : "dark"}
        backgroundColor={
          resolvedScheme === "dark" ? colors.dark.cream : colors.light.cream
        }
        translucent={false}
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="prayer/[id]"
          options={{ headerShown: false, presentation: "card" }}
        />
      </Stack>

      <FirstLaunchPrompt
        visible={showPrompt}
        onGoToSettings={handleGoToSettings}
        onDismiss={handleDismissPrompt}
      />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_400Regular_Italic,
    PlayfairDisplay_600SemiBold,
    Lato_300Light,
    Lato_400Regular,
    Lato_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch((error) => {
        console.warn("[Sacred Words] Could not hide the splash screen.", error);
      });
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ClerkRoot>
            <ClerkApiSession />
            <SubscriptionProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <KeyboardProvider>
                  <RootLayoutNav />
                </KeyboardProvider>
              </GestureHandlerRootView>
            </SubscriptionProvider>
          </ClerkRoot>
        </QueryClientProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
