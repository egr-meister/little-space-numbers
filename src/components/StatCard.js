import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { colors, radius, spacing } from "../theme/colors";

// A small rounded card showing a single statistic value with a label.
export default function StatCard({ label, value, emoji, accent }) {
  const safeValue =
    value === null || value === undefined ? "0" : String(value);
  return (
    <View style={styles.card}>
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
      <Text style={[styles.value, accent ? { color: accent } : null]}>
        {safeValue}
      </Text>
      <Text style={styles.label}>{label ?? ""}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors?.card ?? "#FFFFFF",
    borderRadius: radius?.md ?? 18,
    borderWidth: 1,
    borderColor: colors?.border ?? "#E5E8F4",
    paddingVertical: spacing?.md ?? 16,
    paddingHorizontal: spacing?.sm ?? 10,
    alignItems: "center",
    justifyContent: "center",
    margin: spacing?.xs ?? 6,
    minWidth: 92,
    flexGrow: 1
  },
  emoji: {
    fontSize: 24,
    marginBottom: 2
  },
  value: {
    fontSize: 30,
    fontWeight: "800",
    color: colors?.primary ?? "#6C63FF"
  },
  label: {
    fontSize: 13,
    color: colors?.mutedText ?? "#7B8794",
    textAlign: "center",
    marginTop: 2
  }
});
