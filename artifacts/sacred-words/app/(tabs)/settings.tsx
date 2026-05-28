import React, { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useToast } from "@/hooks/useToast";
import { useTheme, type ThemePreference } from "@/lib/theme";
import { Toast } from "@/components/Toast";
import { getMostUsedTradition } from "@/hooks/useTraditionHistory";
import { loadStreak } from "@/hooks/useStreak";
import {
  getNotificationPreferences,
  saveNotificationPreferences,
  requestNotificationPermission,
  scheduleDailyNotifications,
  cancelAllNotifications,
  NOTIFICATION_TIMES,
  type NotificationTime,
  type PrayerTeaserItem,
} from "@/lib/notifications";

type ActiveNotificationTime = Exclude<NotificationTime, "off">;

const TIME_OPTIONS: Array<{ value: ActiveNotificationTime; label: string; icon: string }> = [
  { value: "morning", label: "Morning", icon: "sun" },
  { value: "midday", label: "Midday", icon: "clock" },
  { value: "evening", label: "Evening", icon: "moon" },
];

async function fetchPrayerTeasers(): Promise<PrayerTeaserItem[]> {
  try {
    const domain = process.env.EXPO_PUBLIC_DOMAIN;
    const base = domain ? `https://${domain}` : "";
    const res = await fetch(`${base}/api/prayers/browse`);
    if (!res.ok) return [];
    const json = (await res.json()) as { prayers: Array<{ id: number; title: string }> };
    return json.prayers.map((p) => ({ id: p.id, title: p.title }));
  } catch {
    return [];
  }
}

const APPEARANCE_OPTIONS: Array<{ value: ThemePreference; label: string; icon: string }> = [
  { value: "system", label: "System", icon: "smartphone" },
  { value: "light", label: "Light", icon: "sun" },
  { value: "dark", label: "Dark", icon: "moon" },
];

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { toast, showToast } = useToast();
  const { preference: themePreference, setPreference: setThemePreference } = useTheme();

  const [enabled, setEnabled] = useState(false);
  const [selectedTime, setSelectedTime] = useState<ActiveNotificationTime>("morning");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mostUsedTradition, setMostUsedTradition] = useState("Universal");
  const [streak, setStreak] = useState(0);

  const topPad = Platform.OS === "web" ? insets.top + 67 : insets.top + 20;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    getMostUsedTradition().then(setMostUsedTradition);
    loadStreak().then((s) => setStreak(s.streak));
    getNotificationPreferences().then((prefs) => {
      if (prefs.time !== "off") {
        setEnabled(true);
        setSelectedTime(prefs.time);
      }
      setLoading(false);
    });
  }, []);

  const applyPreferences = useCallback(
    async (isEnabled: boolean, time: ActiveNotificationTime) => {
      setSaving(true);
      try {
        if (!isEnabled) {
          await cancelAllNotifications();
          await saveNotificationPreferences({ time: "off" });
          showToast("Daily reminders turned off");
          return;
        }

        const granted = await requestNotificationPermission();
        if (!granted) {
          showToast("Please allow notifications in your device settings", "error");
          setEnabled(false);
          return;
        }

        const prayers = await fetchPrayerTeasers();
        if (prayers.length === 0) {
          // Offline or API unavailable — save preference so the schedule is
          // built automatically on the next app launch when prayers can load.
          await saveNotificationPreferences({ time });
          showToast("Reminder saved — previews load on next connection");
          return;
        }
        await scheduleDailyNotifications(time, prayers);
        await saveNotificationPreferences({ time });

        const timeLabel = NOTIFICATION_TIMES[time].label;
        showToast(`Reminder set for ${timeLabel}`);
      } catch {
        showToast("Could not save notification settings", "error");
      } finally {
        setSaving(false);
      }
    },
    [showToast]
  );

  const handleToggle = (value: boolean) => {
    setEnabled(value);
    applyPreferences(value, selectedTime);
  };

  const handleTimeSelect = (time: ActiveNotificationTime) => {
    setSelectedTime(time);
    if (enabled) {
      applyPreferences(true, time);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.cream }]}>
        <ActivityIndicator color={colors.gold} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.cream }]}>
      <Toast message={toast?.message ?? ""} type={toast?.type} visible={!!toast} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: topPad, paddingBottom: bottomPad + 40 }]}
      >
        <Text style={[styles.heading, { color: colors.warmBrown, fontFamily: "PlayfairDisplay_600SemiBold" }]}>
          Settings
        </Text>

        {/* Your Practice stats */}
        <View style={[styles.section, { backgroundColor: colors.parchment, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.warmBrown, fontFamily: "Lato_700Bold" }]}>
            Your Practice
          </Text>
          <View style={styles.statRow}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.gold, fontFamily: "PlayfairDisplay_600SemiBold" }]}>
                {streak}
              </Text>
              <Text style={[styles.statLabel, { color: colors.muted, fontFamily: "Lato_400Regular" }]}>
                Day Streak
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.sage, fontFamily: "PlayfairDisplay_600SemiBold" }]}>
                {mostUsedTradition}
              </Text>
              <Text style={[styles.statLabel, { color: colors.muted, fontFamily: "Lato_400Regular" }]}>
                Favourite Tradition
              </Text>
            </View>
          </View>
        </View>

        {/* Appearance */}
        <View style={[styles.section, { backgroundColor: colors.parchment, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, { backgroundColor: colors.sageLight }]}>
              <Feather name="eye" size={18} color={colors.sage} />
            </View>
            <View style={styles.sectionHeaderText}>
              <Text style={[styles.sectionTitleRow, { color: colors.warmBrown, fontFamily: "Lato_700Bold" }]}>
                Appearance
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.muted, fontFamily: "Lato_400Regular" }]}>
                Choose your preferred colour theme
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.appearanceOptions}>
            {APPEARANCE_OPTIONS.map((option) => {
              const isSelected = themePreference === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setThemePreference(option.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`${option.label} theme`}
                  style={({ pressed }) => [
                    styles.appearanceOption,
                    {
                      backgroundColor: isSelected ? colors.goldLight : "transparent",
                      borderColor: isSelected ? colors.gold : colors.border,
                      opacity: pressed ? 0.75 : 1,
                    },
                  ]}
                >
                  <Feather
                    name={option.icon as "smartphone" | "sun" | "moon"}
                    size={18}
                    color={isSelected ? colors.gold : colors.muted}
                  />
                  <Text
                    style={[
                      styles.appearanceOptionLabel,
                      {
                        color: isSelected ? colors.warmBrown : colors.ink,
                        fontFamily: isSelected ? "Lato_700Bold" : "Lato_400Regular",
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {isSelected && (
                    <Feather name="check" size={16} color={colors.gold} style={styles.appearanceCheck} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Daily Reminder */}
        <View style={[styles.section, { backgroundColor: colors.parchment, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconWrap, { backgroundColor: colors.goldLight }]}>
              <Feather name="bell" size={18} color={colors.gold} />
            </View>
            <View style={styles.sectionHeaderText}>
              <Text style={[styles.sectionTitleRow, { color: colors.warmBrown, fontFamily: "Lato_700Bold" }]}>
                Daily Reminder
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.muted, fontFamily: "Lato_400Regular" }]}>
                A gentle nudge to pause and pray
              </Text>
            </View>
            {saving ? (
              <ActivityIndicator size="small" color={colors.gold} />
            ) : (
              <Switch
                value={enabled}
                onValueChange={handleToggle}
                trackColor={{ false: colors.border, true: colors.gold }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={colors.border}
                accessibilityLabel="Toggle daily prayer reminder"
              />
            )}
          </View>

          {Platform.OS === "web" && (
            <View style={[styles.webNote, { backgroundColor: colors.goldLight, borderColor: colors.gold }]}>
              <Text style={[styles.webNoteText, { color: colors.warmBrown, fontFamily: "Lato_400Regular" }]}>
                Push notifications are available on the iOS and Android apps.
              </Text>
            </View>
          )}

          {enabled && Platform.OS !== "web" && (
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          )}

          {enabled && Platform.OS !== "web" && (
            <View style={styles.timeOptions}>
              <Text style={[styles.timeLabel, { color: colors.muted, fontFamily: "Lato_700Bold" }]}>
                REMIND ME AT
              </Text>
              {TIME_OPTIONS.map((option) => {
                const isSelected = selectedTime === option.value;
                const timeInfo = NOTIFICATION_TIMES[option.value];
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => handleTimeSelect(option.value)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={`${option.label} — ${timeInfo.label}`}
                    style={({ pressed }) => [
                      styles.timeOption,
                      {
                        backgroundColor: isSelected ? colors.goldLight : "transparent",
                        borderColor: isSelected ? colors.gold : colors.border,
                        opacity: pressed ? 0.75 : 1,
                      },
                    ]}
                  >
                    <View style={styles.timeOptionLeft}>
                      <Feather
                        name={option.icon as "sun" | "clock" | "moon"}
                        size={18}
                        color={isSelected ? colors.gold : colors.muted}
                      />
                      <View>
                        <Text
                          style={[
                            styles.timeOptionName,
                            {
                              color: isSelected ? colors.warmBrown : colors.ink,
                              fontFamily: isSelected ? "Lato_700Bold" : "Lato_400Regular",
                            },
                          ]}
                        >
                          {option.label}
                        </Text>
                        <Text style={[styles.timeOptionDetail, { color: colors.muted, fontFamily: "Lato_400Regular" }]}>
                          {timeInfo.label}
                        </Text>
                      </View>
                    </View>
                    {isSelected && (
                      <Feather name="check" size={18} color={colors.gold} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {/* Info card */}
        <View style={[styles.infoCard, { backgroundColor: colors.sageLight, borderColor: colors.sage + "40" }]}>
          <Feather name="info" size={15} color={colors.sage} style={{ marginTop: 1 }} />
          <Text style={[styles.infoText, { color: colors.sage, fontFamily: "Lato_400Regular" }]}>
            Each notification features a title from the community prayer collection. Tap it to open that prayer in the Browse tab.
          </Text>
        </View>

        {/* About */}
        <View style={[styles.section, { backgroundColor: colors.parchment, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.warmBrown, fontFamily: "Lato_700Bold" }]}>
            About Sacred Words
          </Text>
          <Text style={[styles.aboutText, { color: colors.muted, fontFamily: "Lato_400Regular" }]}>
            A multi-faith prayer companion. Build meaningful prayers, save them to your personal library, and discover prayers from the global community.
          </Text>
          <Text style={[styles.version, { color: colors.muted, fontFamily: "Lato_400Regular" }]}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  scroll: { paddingHorizontal: 20, gap: 20 },
  heading: { fontSize: 28, lineHeight: 36 },

  section: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeaderText: { flex: 1 },
  sectionTitle: { fontSize: 15, textTransform: "uppercase", letterSpacing: 0.5 },
  sectionTitleRow: { fontSize: 16 },
  sectionSubtitle: { fontSize: 13, marginTop: 1 },

  statRow: { flexDirection: "row", alignItems: "center" },
  stat: { flex: 1, alignItems: "center", gap: 4 },
  statDivider: { width: 1, height: 40, marginHorizontal: 16 },
  statValue: { fontSize: 26, lineHeight: 32 },
  statLabel: { fontSize: 13, textAlign: "center" },

  webNote: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
  },
  webNoteText: { fontSize: 14, lineHeight: 22 },

  divider: { height: StyleSheet.hairlineWidth, marginHorizontal: -20 },

  timeOptions: { gap: 8 },
  timeLabel: { fontSize: 11, letterSpacing: 0.8, marginBottom: 4 },
  timeOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  timeOptionLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  timeOptionName: { fontSize: 15 },
  timeOptionDetail: { fontSize: 13, marginTop: 1 },

  appearanceOptions: { gap: 8 },
  appearanceOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  appearanceOptionLabel: { flex: 1, fontSize: 15 },
  appearanceCheck: { marginLeft: "auto" },

  infoCard: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  infoText: { flex: 1, fontSize: 13, lineHeight: 20 },

  aboutText: { fontSize: 15, lineHeight: 24 },
  version: { fontSize: 13 },
});
