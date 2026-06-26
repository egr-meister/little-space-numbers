import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";

import { colors, radius, spacing } from "../theme/colors";

// A big tappable number card used as an answer choice.
// state: "idle" | "correct" | "wrong" | "muted"
export default function AnswerCard({ value, onPress, disabled = false, state = "idle" }) {
  const display = value === null || value === undefined ? "?" : String(value);

  const stateStyle =
    state === "correct"
      ? styles.correct
      : state === "wrong"
      ? styles.wrong
      : state === "muted"
      ? styles.muted
      : null;

  const textStyle =
    state === "correct" || state === "wrong" ? styles.textOnColor : styles.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`Answer ${display}`}
      style={({ pressed }) => [
        styles.card,
        stateStyle,
        pressed && !disabled ? styles.pressed : null
      ]}
    >
      <Text style={textStyle}>{display}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 96,
    height: 96,
    borderRadius: radius?.lg ?? 26,
    borderWidth: 2,
    borderColor: colors?.border ?? "#E5E8F4",
    backgroundColor: colors?.card ?? "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    margin: spacing?.sm ?? 10
  },
  correct: {
    backgroundColor: colors?.success ?? "#52B788",
    borderColor: colors?.success ?? "#52B788"
  },
  wrong: {
    // Gentle, non-stressful indication for an incorrect pick.
    backgroundColor: colors?.softPurple ?? "#CDB4DB",
    borderColor: colors?.softPurple ?? "#CDB4DB"
  },
  muted: {
    opacity: 0.55
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }]
  },
  text: {
    fontSize: 40,
    fontWeight: "800",
    color: colors?.primary ?? "#6C63FF"
  },
  textOnColor: {
    fontSize: 40,
    fontWeight: "800",
    color: "#FFFFFF"
  }
});
