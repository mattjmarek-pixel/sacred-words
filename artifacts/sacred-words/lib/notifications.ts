import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const PREFS_KEY = "sacred_words_notification_prefs";

// iOS caps scheduled local notifications at 64; 30 days gives ~2 months of
// uninterrupted coverage even if the user rarely opens the app.
const DAYS_TO_SCHEDULE = 30;

// Re-schedule when fewer than this many future notifications remain.
const RESCHEDULE_THRESHOLD = 7;

export type NotificationTime = "morning" | "midday" | "evening" | "off";

export interface NotificationPreferences {
  time: NotificationTime;
}

export const NOTIFICATION_TIMES: Record<
  Exclude<NotificationTime, "off">,
  { label: string; hour: number; minute: number; greeting: string }
> = {
  morning: { label: "Morning (7:00 AM)", hour: 7, minute: 0, greeting: "Good morning" },
  midday: { label: "Midday (12:00 PM)", hour: 12, minute: 0, greeting: "A midday pause" },
  evening: { label: "Evening (8:00 PM)", hour: 20, minute: 0, greeting: "This evening" },
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/** Fisher-Yates shuffle — returns a new shuffled array. */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  try {
    const raw = await AsyncStorage.getItem(PREFS_KEY);
    if (!raw) return { time: "off" };
    return JSON.parse(raw) as NotificationPreferences;
  } catch {
    return { time: "off" };
  }
}

export async function saveNotificationPreferences(
  prefs: NotificationPreferences
): Promise<void> {
  await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export interface PrayerTeaserItem {
  id: number;
  title: string;
}

/**
 * Returns true when there are fewer than RESCHEDULE_THRESHOLD future
 * notifications queued, so the caller knows a refresh is needed.
 */
export async function needsReschedule(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    return scheduled.length < RESCHEDULE_THRESHOLD;
  } catch {
    return true;
  }
}

/**
 * Cancels all scheduled notifications and schedules DAYS_TO_SCHEDULE fresh
 * ones at the given time, each showing a randomly chosen community prayer.
 * Prayers are shuffled so the sequence is different on every reschedule.
 */
export async function scheduleDailyNotifications(
  time: Exclude<NotificationTime, "off">,
  prayers: PrayerTeaserItem[]
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (prayers.length === 0) return;

  const { hour, minute, greeting } = NOTIFICATION_TIMES[time];
  const now = new Date();

  // Shuffle so the order is random each time we reschedule.
  const shuffled = shuffle(prayers);

  // Compute the first valid trigger once so that every subsequent day is
  // a clean +1, +2, … offset with no duplicate dates.
  const firstTrigger = new Date(now);
  firstTrigger.setHours(hour, minute, 0, 0);
  if (firstTrigger <= now) {
    // Today's slot has already passed — start from the same time tomorrow.
    firstTrigger.setDate(firstTrigger.getDate() + 1);
  }

  for (let day = 0; day < DAYS_TO_SCHEDULE; day++) {
    const prayer = shuffled[day % shuffled.length];
    const trigger = new Date(firstTrigger);
    trigger.setDate(firstTrigger.getDate() + day);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${greeting} — a prayer awaits`,
        body: prayer.title,
        data: { prayerId: prayer.id },
        sound: false,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: trigger,
      },
    });
  }
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
