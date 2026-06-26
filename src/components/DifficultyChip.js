import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";

import { colors, radius, spacing } from "../theme/colors";

// A pill-shaped selectable chip for choosing difficulty.
export default function DifficultyChip({ title, selected = false, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.selected : null,
        pressed ? styles.pressed : null
      ]}
    >
      <Text style={[styles.label, selected ? styles.labelSelected : null]}>
        {title ?? ""}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 52,
    paddingVertical: spacing?.sm ?? 10,
    paddingHorizontal: spacing?.lg ?? 24,
    borderRadius: radius?.pill ?? 999,
    borderWidth: 2,
    borderColor: colors?.border ?? "#E5E8F4",
    backgroundColor: colors?.card ?? "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: spacing?.xs ?? 6,
    marginVertical: spacing?.xs ?? 6,
    minWidth: 92
  },
  selected: {
    backgroundColor: colors?.secondary ?? "#70C1B3",
    borderColor: colors?.secondary ?? "#70C1B3"
  },
  pressed: {
    opacity: 0.9
  },
  label: {
    fontSize: 17,
    fontWeight: "700",
    color: colors?.text ?? "#2E3440"
  },
  labelSelected: {
    color: "#FFFFFF"
  }
});
