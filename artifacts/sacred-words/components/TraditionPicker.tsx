import React from "react";
import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { LAUNCH_TRADITIONS, type LaunchTradition } from "@/lib/traditions";

interface TraditionPickerProps {
  selected: LaunchTradition;
  onSelect: (value: LaunchTradition) => void;
}

export function TraditionPicker({ selected, onSelect }: TraditionPickerProps) {
  const colors = useColors();

  return (
    <View style={styles.options}>
      {LAUNCH_TRADITIONS.map(({ value, label, description }) => {
        const isSelected = selected === value;
        return (
          <Pressable
            key={value}
            testID={`tradition-option-${value.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            onPress={() => onSelect(value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${label}. ${description}`}
            style={({ pressed }) => [
              styles.option,
              {
                backgroundColor: isSelected ? colors.goldLight : colors.parchment,
                borderColor: isSelected ? colors.gold : colors.border,
                opacity: pressed ? 0.82 : 1,
              },
            ]}
          >
            <View style={styles.copy}>
              <Text
                style={[
                  styles.label,
                  {
                    color: isSelected ? colors.warmBrown : colors.ink,
                    fontFamily: isSelected ? "Lato_700Bold" : "Lato_400Regular",
                  },
                ]}
              >
                {label}
              </Text>
              <Text
                numberOfLines={2}
                style={[styles.description, { color: colors.muted, fontFamily: "Lato_400Regular" }]}
              >
                {description}
              </Text>
            </View>
            <Feather
              name={isSelected ? "check-circle" : "circle"}
              size={19}
              color={isSelected ? colors.gold : colors.border}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  options: {
    paddingHorizontal: 20,
    gap: 8,
  },
  option: {
    minHeight: 58,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 15,
    lineHeight: 19,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },
});
