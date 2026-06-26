import React from "react";
import { Text, Pressable, StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "../theme/colors";

// Selectable card for a game mode on the Game Picker screen.
export default function GameModeCard({ title, description, emoji, selected = false, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.card,
        selected ? styles.selected : null,
        pressed ? styles.pressed : null
      ]}
    >
      <Text style={styles.emoji}>{emoji ?? "⭐"}</Text>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title ?? "Game"}</Text>
        <Text style={styles.description}>{description ?? ""}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors?.card ?? "#FFFFFF",
    borderRadius: radius?.lg ?? 26,
    borderWidth: 2,
    borderColor: colors?.border ?? "#E5E8F4",
    padding: spacing?.md ?? 16,
    marginVertical: spacing?.xs ?? 6
  },
  selected: {
    borderColor: colors?.primary ?? "#6C63FF",
    backgroundColor: "#EEECFF"
  },
  pressed: {
    opacity: 0.9
  },
  emoji: {
    fontSize: 36,
    marginRight: spacing?.md ?? 16
  },
  textWrap: {
    flex: 1
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors?.text ?? "#2E3440"
  },
  description: {
    fontSize: 15,
    color: colors?.mutedText ?? "#7B8794",
    marginTop: 2
  }
});
