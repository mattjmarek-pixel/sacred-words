import AsyncStorage from "@react-native-async-storage/async-storage";

const TRADITION_HISTORY_KEY = "sacred_words_tradition_history";
const DEFAULT_TRADITION = "Universal";

interface TraditionHistory {
  counts: Record<string, number>;
}

export async function recordTraditionUsed(tradition: string): Promise<void> {
  const raw = await AsyncStorage.getItem(TRADITION_HISTORY_KEY);
  const history: TraditionHistory = raw ? JSON.parse(raw) : { counts: {} };
  history.counts[tradition] = (history.counts[tradition] ?? 0) + 1;
  await AsyncStorage.setItem(TRADITION_HISTORY_KEY, JSON.stringify(history));
}

export async function getMostUsedTradition(): Promise<string> {
  const raw = await AsyncStorage.getItem(TRADITION_HISTORY_KEY);
  if (!raw) return DEFAULT_TRADITION;
  const history: TraditionHistory = JSON.parse(raw);
  const entries = Object.entries(history.counts);
  if (entries.length === 0) return DEFAULT_TRADITION;
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}
