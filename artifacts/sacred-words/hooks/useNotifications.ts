import { useState, useEffect, useCallback } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTIF_ENABLED_KEY = "sacred_words_notif_enabled";
const NOTIF_HOUR_KEY = "sacred_words_notif_hour";
const NOTIF_MINUTE_KEY = "sacred_words_notif_minute";

const DEFAULT_HOUR = 8;
const DEFAULT_MINUTE = 0;
const DAILY_NOTIF_ID = "sacred_words_daily_prompt";

async function getExpoNotifications() {
  if (Platform.OS === "web") return null;
  try {
    return await import("expo-notifications");
  } catch {
    return null;
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  const Notifications = await getExpoNotifications();
  if (!Notifications) return false;
  const existing = (await Notifications.getPermissionsAsync()) as unknown as { granted: boolean };
  if (existing.granted) return true;
  const result = (await Notifications.requestPermissionsAsync()) as unknown as { granted: boolean };
  return result.granted;
}

export async function scheduleDailyNotification(hour: number, minute: number, tradition: string): Promise<void> {
  const Notifications = await getExpoNotifications();
  if (!Notifications) return;

  await Notifications.cancelScheduledNotificationAsync(DAILY_NOTIF_ID).catch(() => undefined);

  const body = tradition === "Universal" || !tradition
    ? "Your moment of reflection awaits. Take a breath and build today's prayer."
    : `A moment of ${tradition} reflection awaits. Build today's prayer.`;

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_NOTIF_ID,
    content: {
      title: "Sacred Words",
      body,
      data: { tradition },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelDailyNotification(): Promise<void> {
  const Notifications = await getExpoNotifications();
  if (!Notifications) return;
  await Notifications.cancelScheduledNotificationAsync(DAILY_NOTIF_ID).catch(() => undefined);
}

export async function loadNotificationSettings(): Promise<{ enabled: boolean; hour: number; minute: number }> {
  const [enabled, hour, minute] = await Promise.all([
    AsyncStorage.getItem(NOTIF_ENABLED_KEY),
    AsyncStorage.getItem(NOTIF_HOUR_KEY),
    AsyncStorage.getItem(NOTIF_MINUTE_KEY),
  ]);
  return {
    enabled: enabled === "true",
    hour: hour !== null ? parseInt(hour, 10) : DEFAULT_HOUR,
    minute: minute !== null ? parseInt(minute, 10) : DEFAULT_MINUTE,
  };
}

export async function saveNotificationSettings(enabled: boolean, hour: number, minute: number): Promise<void> {
  await Promise.all([
    AsyncStorage.setItem(NOTIF_ENABLED_KEY, String(enabled)),
    AsyncStorage.setItem(NOTIF_HOUR_KEY, String(hour)),
    AsyncStorage.setItem(NOTIF_MINUTE_KEY, String(minute)),
  ]);
}

export function useNotificationSettings() {
  const [enabled, setEnabled] = useState(false);
  const [hour, setHour] = useState(DEFAULT_HOUR);
  const [minute, setMinute] = useState(DEFAULT_MINUTE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotificationSettings().then((s) => {
      setEnabled(s.enabled);
      setHour(s.hour);
      setMinute(s.minute);
      setLoading(false);
    });
  }, []);

  const toggle = useCallback(async (tradition: string) => {
    const next = !enabled;
    setEnabled(next);
    await saveNotificationSettings(next, hour, minute);
    if (next) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        setEnabled(false);
        await saveNotificationSettings(false, hour, minute);
        return false;
      }
      await scheduleDailyNotification(hour, minute, tradition);
    } else {
      await cancelDailyNotification();
    }
    return next;
  }, [enabled, hour, minute]);

  const updateTime = useCallback(async (newHour: number, newMinute: number, tradition: string) => {
    setHour(newHour);
    setMinute(newMinute);
    await saveNotificationSettings(enabled, newHour, newMinute);
    if (enabled) {
      await scheduleDailyNotification(newHour, newMinute, tradition);
    }
  }, [enabled]);

  return { enabled, hour, minute, loading, toggle, updateTime };
}
