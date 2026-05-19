import React, { forwardRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFonts, PlayfairDisplay_400Regular_Italic, PlayfairDisplay_600SemiBold } from "@expo-google-fonts/playfair-display";

interface PrayerShareCardProps {
  title: string;
  text: string;
  tradition: string;
}

const TRADITION_SYMBOLS: Record<string, string> = {
  Christian: "✝",
  Jewish: "✡",
  Islamic: "☪",
  Buddhist: "☸",
  Hindu: "ॐ",
  Indigenous: "☽",
  Universal: "🕯",
  Secular: "✦",
};

const PrayerShareCard = forwardRef<View, PrayerShareCardProps>(
  ({ title, text, tradition }, ref) => {
    const [fontsLoaded] = useFonts({
      PlayfairDisplay_400Regular_Italic,
      PlayfairDisplay_600SemiBold,
    });

    const symbol = TRADITION_SYMBOLS[tradition] ?? "🕯";
    const titleFont = fontsLoaded ? "PlayfairDisplay_600SemiBold" : undefined;
    const bodyFont = fontsLoaded ? "PlayfairDisplay_400Regular_Italic" : undefined;

    return (
      <View ref={ref} style={styles.card} collapsable={false}>
        <View style={styles.inner}>
          <View style={styles.topRow}>
            <Text style={styles.symbol}>{symbol}</Text>
            <View style={styles.badge}>
              <Text style={[styles.badgeText, { fontFamily: titleFont }]}>{tradition}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={[styles.title, { fontFamily: titleFont }]}>{title}</Text>

          <Text style={[styles.prayerText, { fontFamily: bodyFont }]}>{text}</Text>

          <View style={styles.divider} />

          <View style={styles.footer}>
            <Text style={styles.footerSymbol}>🕯</Text>
            <Text style={[styles.footerBrand, { fontFamily: titleFont }]}>Sacred Words</Text>
          </View>
        </View>
      </View>
    );
  }
);

PrayerShareCard.displayName = "PrayerShareCard";

export default PrayerShareCard;

const styles = StyleSheet.create({
  card: {
    width: 380,
    backgroundColor: "#F0EBE0",
    borderRadius: 18,
    padding: 2,
    shadowColor: "rgba(92, 61, 46, 0.25)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  inner: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#DDD3C4",
    padding: 28,
    gap: 16,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  symbol: {
    fontSize: 28,
    color: "#C9943A",
  },
  badge: {
    backgroundColor: "#D6EAD8",
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 13,
    color: "#7A9E7E",
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  divider: {
    height: 1,
    backgroundColor: "#DDD3C4",
    marginVertical: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#5C3D2E",
    lineHeight: 28,
  },
  prayerText: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#2E2318",
    lineHeight: 32,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  footerSymbol: {
    fontSize: 16,
  },
  footerBrand: {
    fontSize: 15,
    color: "#8C7B6B",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
