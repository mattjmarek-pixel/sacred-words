import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useCallback } from "react";

export interface SavedPrayer {
  id: string;
  title: string;
  tradition: string;
  intention: string;
  text: string;
  createdAt: string;
}

const STORAGE_KEY = "sacred_words_prayers";

async function loadPrayers(): Promise<SavedPrayer[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedPrayer[];
  } catch {
    return [];
  }
}

async function storePrayers(prayers: SavedPrayer[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prayers));
}

export function useSavedPrayers() {
  const [prayers, setPrayers] = useState<SavedPrayer[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    const loaded = await loadPrayers();
    setPrayers(loaded.slice().reverse());
    setLoading(false);
  }, []);

  return { prayers, loading, refetch };
}

export async function savePrayer(
  prayer: Omit<SavedPrayer, "id" | "createdAt">
): Promise<SavedPrayer> {
  const existing = await loadPrayers();
  const newPrayer: SavedPrayer = {
    ...prayer,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
  };
  await storePrayers([...existing, newPrayer]);
  return newPrayer;
}

export async function deletePrayer(id: string): Promise<void> {
  const existing = await loadPrayers();
  const updated = existing.filter((p) => p.id !== id);
  await storePrayers(updated);
}

export async function updatePrayerTitle(id: string, title: string): Promise<void> {
  const existing = await loadPrayers();
  const updated = existing.map((p) => (p.id === id ? { ...p, title } : p));
  await storePrayers(updated);
}

export async function getPrayerById(id: string): Promise<SavedPrayer | null> {
  const prayers = await loadPrayers();
  return prayers.find((p) => p.id === id) ?? null;
}

export async function searchPrayers(query: string): Promise<SavedPrayer[]> {
  const prayers = await loadPrayers();
  const q = query.toLowerCase();
  return prayers
    .filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.text.toLowerCase().includes(q) ||
        p.tradition.toLowerCase().includes(q)
    )
    .reverse();
}
