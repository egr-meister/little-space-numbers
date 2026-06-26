import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { colors, radius, spacing } from "../theme/colors";

// A friendly, never-blank placeholder for screens with no data yet.
export default function EmptyState({ emoji = "🌙", title, message }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.emoji}>{emoji}</Text>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors?.card ?? "#FFFFFF",
    borderRadius: radius?.lg ?? 26,
    borderWidth: 1,
    borderColor: colors?.border ?? "#E5E8F4",
    padding: spacing?.lg ?? 24,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing?.sm ?? 10
  },
  emoji: {
    fontSize: 46,
    marginBottom: spacing?.sm ?? 10
  },
  title: {
    fontSize: 19,
    fontWeight: "700",
    color: colors?.text ?? "#2E3440",
    textAlign: "center"
  },
  message: {
    fontSize: 15,
    color: colors?.mutedText ?? "#7B8794",
    textAlign: "center",
    marginTop: 4
  }
});
