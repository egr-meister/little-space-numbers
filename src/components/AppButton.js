import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";

import { colors, radius, spacing } from "../theme/colors";

// Large, rounded, child-friendly tap target.
// variant: "primary" | "secondary" | "soft" | "danger"
export default function AppButton({ label, onPress, variant = "primary", disabled = false, style }) {
  const palette = {
    primary: { bg: colors?.primary ?? "#6C63FF", text: "#FFFFFF" },
    secondary: { bg: colors?.secondary ?? "#70C1B3", text: "#FFFFFF" },
    soft: { bg: colors?.spaceBlue ?? "#A0C4FF", text: colors?.text ?? "#2E3440" },
    danger: { bg: colors?.danger ?? "#E76F51", text: "#FFFFFF" }
  };
  const chosen = palette[variant] ?? palette.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: chosen.bg },
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
        style
      ]}
    >
      <Text style={[styles.label, { color: chosen.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 60,
    borderRadius: radius?.lg ?? 26,
    paddingVertical: spacing?.md ?? 16,
    paddingHorizontal: spacing?.lg ?? 24,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing?.xs ?? 6
  },
  label: {
    fontSize: 20,
    fontWeight: "700"
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }]
  },
  disabled: {
    opacity: 0.5
  }
});
