import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import type { SavedPrayer } from "@/hooks/useDatabase";

interface PrayerCardProps {
  prayer: SavedPrayer | {
    id: number | string;
    title: string;
    tradition: string;
    intention: string;
    text: string;
    createdAt: string;
  };
  onPress: () => void;
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
}

export function PrayerCard({ prayer, onPress }: PrayerCardProps) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Prayer: ${prayer.title}`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.parchment,
          borderColor: colors.border,
          shadowColor: colors.shadow,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.main}>
          <Text
            style={[
              styles.title,
              { color: colors.warmBrown, fontFamily: "PlayfairDisplay_600SemiBold" },
            ]}
            numberOfLines={1}
          >
            {prayer.title}
          </Text>
          <Text
            style={[
              styles.excerpt,
              { color: colors.muted, fontFamily: "Lato_400Regular" },
            ]}
            numberOfLines={2}
          >
            {prayer.text}
          </Text>
          <View style={styles.meta}>
            <View
              style={[
                styles.badge,
                { backgroundColor: colors.sageLight },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: colors.sage, fontFamily: "Lato_700Bold" },
                ]}
              >
                {prayer.tradition}
              </Text>
            </View>
            <Text style={[styles.date, { color: colors.muted, fontFamily: "Lato_400Regular" }]}>
              {formatDate(prayer.createdAt)}
            </Text>
          </View>
        </View>
        <Feather name="chevron-right" size={18} color={colors.muted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  main: {
    flex: 1,
    gap: 8,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
  },
  excerpt: {
    fontSize: 14,
    lineHeight: 20,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 100,
  },
  badgeText: {
    fontSize: 12,
  },
  date: {
    fontSize: 12,
  },
});
