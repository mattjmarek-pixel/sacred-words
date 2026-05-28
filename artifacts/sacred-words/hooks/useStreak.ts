import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useCallback } from "react";

const STREAK_KEY = "sacred_words_streak_days";
const LAST_ACTIVITY_KEY = "sacred_words_last_activity";

export interface StreakData {
  streak: number;
  lastActivityDate: string | null;
}

function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export async function recordPrayerActivity(): Promise<StreakData> {
  const today = todayKey();
  const yesterday = yesterdayKey();

  const [rawDays, lastActivity] = await Promise.all([
    AsyncStorage.getItem(STREAK_KEY),
    AsyncStorage.getItem(LAST_ACTIVITY_KEY),
  ]);

  const days: Set<string> = new Set(rawDays ? JSON.parse(rawDays) : []);
  days.add(today);

  let streak = 1;
  let check = today;
  while (true) {
    const prev = new Date(check);
    prev.setDate(prev.getDate() - 1);
    const prevKey = prev.toISOString().split("T")[0];
    if (days.has(prevKey)) {
      streak++;
      check = prevKey;
    } else {
      break;
    }
  }

  const daysArray = Array.from(days).sort();
  await Promise.all([
    AsyncStorage.setItem(STREAK_KEY, JSON.stringify(daysArray)),
    AsyncStorage.setItem(LAST_ACTIVITY_KEY, today),
  ]);

  return { streak, lastActivityDate: today };
}

export async function loadStreak(): Promise<StreakData> {
  const [rawDays, lastActivity] = await Promise.all([
    AsyncStorage.getItem(STREAK_KEY),
    AsyncStorage.getItem(LAST_ACTIVITY_KEY),
  ]);

  if (!rawDays || !lastActivity) return { streak: 0, lastActivityDate: null };

  const today = todayKey();
  const yesterday = yesterdayKey();
  if (lastActivity !== today && lastActivity !== yesterday) {
    return { streak: 0, lastActivityDate: lastActivity };
  }

  const days: Set<string> = new Set(JSON.parse(rawDays));
  let streak = 0;
  let check = today;
  while (days.has(check)) {
    streak++;
    const prev = new Date(check);
    prev.setDate(prev.getDate() - 1);
    check = prev.toISOString().split("T")[0];
  }

  return { streak, lastActivityDate: lastActivity };
}

export async function getPrayerHistory(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(STREAK_KEY);
  if (!raw) return [];
  return (JSON.parse(raw) as string[]).slice().reverse();
}

export function useStreak() {
  const [streak, setStreak] = useState(0);
  const [lastActivity, setLastActivity] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const data = await loadStreak();
    setStreak(data.streak);
    setLastActivity(data.lastActivityDate);
  }, []);

  const record = useCallback(async (): Promise<number> => {
    const data = await recordPrayerActivity();
    setStreak(data.streak);
    setLastActivity(data.lastActivityDate);
    return data.streak;
  }, []);

  return { streak, lastActivity, refresh, record };
}

export const MILESTONE_DAYS = [3, 7, 14, 30];
