import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";

const MILESTONE_MESSAGES: Record<number, { emoji: string; headline: string; body: string }> = {
  3: {
    emoji: "🕯️",
    headline: "3-Day Streak",
    body: "Three days of prayer — a rhythm is forming. Keep the flame alive.",
  },
  7: {
    emoji: "✨",
    headline: "One Week Strong",
    body: "Seven days of showing up. That's a week of intention turned into practice.",
  },
  14: {
    emoji: "🌿",
    headline: "Two Weeks",
    body: "Fourteen days. What began as a decision is becoming a way of life.",
  },
  30: {
    emoji: "🔥",
    headline: "30-Day Milestone",
    body: "A full month of daily prayer. You've built something real and lasting.",
  },
};

interface MilestoneModalProps {
  visible: boolean;
  streak: number;
  onClose: () => void;
}

export function MilestoneModal({ visible, streak, onClose }: MilestoneModalProps) {
  const colors = useColors();
  const scale = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const info = MILESTONE_MESSAGES[streak];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 14, stiffness: 160 }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      scale.setValue(0.7);
      opacity.setValue(0);
    }
  }, [visible]);

  if (!info) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={[styles.backdrop, { backgroundColor: "rgba(46,35,24,0.55)" }]} onPress={onClose}>
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: colors.parchment, borderColor: colors.gold, transform: [{ scale }], opacity },
          ]}
        >
          <Text style={styles.emoji}>{info.emoji}</Text>
          <Text style={[styles.headline, { color: colors.warmBrown, fontFamily: "PlayfairDisplay_600SemiBold" }]}>
            {info.headline}
          </Text>
          <Text style={[styles.body, { color: colors.ink, fontFamily: "Lato_400Regular" }]}>
            {info.body}
          </Text>
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Continue"
            style={[styles.btn, { backgroundColor: colors.gold }]}
          >
            <Text style={[styles.btnText, { fontFamily: "Lato_700Bold" }]}>Keep Going →</Text>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  card: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 32,
    alignItems: "center",
    gap: 14,
    shadowColor: "#2E2318",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
  },
  emoji: { fontSize: 52 },
  headline: { fontSize: 26, textAlign: "center", lineHeight: 32 },
  body: { fontSize: 16, textAlign: "center", lineHeight: 26 },
  btn: {
    marginTop: 8,
    height: 52,
    paddingHorizontal: 32,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16 },
});
