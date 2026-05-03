import React, { useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  variant?: "gold" | "sage";
  disabled?: boolean;
}

function Chip({ label, selected, onPress, variant = "gold", disabled }: ChipProps) {
  const colors = useColors();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.06,
        useNativeDriver: true,
        damping: 10,
        stiffness: 300,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        damping: 10,
        stiffness: 300,
      }),
    ]).start();
    onPress();
  };

  const bgColor = selected
    ? variant === "gold"
      ? colors.gold
      : colors.sage
    : colors.card;

  const textColor = selected ? colors.ink : colors.ink;
  const borderColor = selected
    ? variant === "gold"
      ? colors.gold
      : colors.sage
    : colors.border;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={handlePress}
        accessibilityRole="radio"
        accessibilityState={{ selected }}
        accessibilityLabel={label}
        style={[
          styles.chip,
          {
            backgroundColor: bgColor,
            borderColor,
          },
        ]}
      >
        <Text
          style={[
            styles.chipText,
            {
              color: textColor,
              fontFamily: selected ? "Lato_700Bold" : "Lato_400Regular",
            },
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

interface ChipSelectorProps {
  options: string[];
  selected: string | string[];
  onSelect: (value: string) => void;
  multiSelect?: boolean;
  maxSelect?: number;
  variant?: "gold" | "sage";
  horizontal?: boolean;
}

export function ChipSelector({
  options,
  selected,
  onSelect,
  multiSelect = false,
  maxSelect,
  variant = "gold",
  horizontal = false,
}: ChipSelectorProps) {
  const isSelected = (option: string) => {
    if (multiSelect) {
      return Array.isArray(selected) && selected.includes(option);
    }
    return selected === option;
  };

  const isDisabled = (option: string) => {
    if (!multiSelect || !maxSelect) return false;
    const count = Array.isArray(selected) ? selected.length : 0;
    return count >= maxSelect && !isSelected(option);
  };

  if (horizontal) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalContainer}
      >
        {options.map((option) => (
          <Chip
            key={option}
            label={option}
            selected={isSelected(option)}
            onPress={() => onSelect(option)}
            variant={variant}
            disabled={isDisabled(option)}
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={styles.wrapContainer}>
      {options.map((option) => (
        <Chip
          key={option}
          label={option}
          selected={isSelected(option)}
          onPress={() => onSelect(option)}
          variant={variant}
          disabled={isDisabled(option)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  horizontalContainer: {
    paddingHorizontal: 20,
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  wrapContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 10,
  },
  chip: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 100,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  chipText: {
    fontSize: 16,
  },
});
