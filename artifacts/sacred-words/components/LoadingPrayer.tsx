import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useColors } from "@/hooks/useColors";

function SkeletonRow({ width }: { width: string | number }) {
  const colors = useColors();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeletonRow,
        { width, backgroundColor: colors.border, opacity },
      ]}
    />
  );
}

export function LoadingPrayer() {
  const colors = useColors();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.parchment, borderColor: colors.border },
      ]}
    >
      <SkeletonRow width="60%" />
      <SkeletonRow width="100%" />
      <SkeletonRow width="90%" />
      <SkeletonRow width="85%" />
      <SkeletonRow width="70%" />
    </View>
  );
}

export function LoadingCards() {
  return (
    <View>
      <LoadingPrayer />
      <LoadingPrayer />
      <LoadingPrayer />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    padding: 20,
    gap: 12,
  },
  skeletonRow: {
    height: 14,
    borderRadius: 7,
  },
});
