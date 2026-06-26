import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { colors, radius, spacing } from "../theme/colors";

// Displays one astronaut sticker. Locked stickers are shown softly so children
// can see what is still ahead. Stickers are learning markers with no money value.
export default function AstronautSticker({ title, emoji, description, unlocked = false }) {
  return (
    <View style={[styles.card, unlocked ? styles.unlocked : styles.locked]}>
      <Text style={[styles.emoji, !unlocked ? styles.dim : null]}>
        {unlocked ? (emoji ?? "🏅") : "🔒"}
      </Text>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title ?? "Sticker"}</Text>
        <Text style={styles.description}>{description ?? ""}</Text>
        <Text style={[styles.status, unlocked ? styles.statusUnlocked : null]}>
          {unlocked ? "Unlocked — well done!" : "Keep going"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius?.lg ?? 26,
    borderWidth: 2,
    padding: spacing?.md ?? 16,
    marginVertical: spacing?.xs ?? 6,
    backgroundColor: colors?.card ?? "#FFFFFF"
  },
  unlocked: {
    borderColor: colors?.accent ?? "#FFD166",
    backgroundColor: "#FFF8E6"
  },
  locked: {
    borderColor: colors?.border ?? "#E5E8F4"
  },
  emoji: {
    fontSize: 40,
    marginRight: spacing?.md ?? 16
  },
  dim: {
    opacity: 0.6
  },
  textWrap: {
    flex: 1
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors?.text ?? "#2E3440"
  },
  description: {
    fontSize: 14,
    color: colors?.mutedText ?? "#7B8794",
    marginTop: 2
  },
  status: {
    fontSize: 13,
    color: colors?.mutedText ?? "#7B8794",
    marginTop: 4,
    fontWeight: "600"
  },
  statusUnlocked: {
    color: colors?.success ?? "#52B788"
  }
});
