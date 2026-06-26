import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { colors, radius, spacing } from "../theme/colors";
import SpaceObjectGroup from "./SpaceObjectGroup";

// A rounded card that shows a number, an optional space-object group, and a
// short label. Used on the Number Learning screen.
export default function NumberCard({ number, objectType = "star", emoji, label, showGroup = true }) {
  const value = Number.isFinite(Number(number)) ? Number(number) : 1;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.number}>{value}</Text>
        {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
      </View>
      {showGroup ? (
        <SpaceObjectGroup count={value} objectType={objectType} size={28} />
      ) : null}
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors?.card ?? "#FFFFFF",
    borderRadius: radius?.lg ?? 26,
    borderWidth: 1,
    borderColor: colors?.border ?? "#E5E8F4",
    padding: spacing?.md ?? 16,
    marginVertical: spacing?.xs ?? 6
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing?.xs ?? 6
  },
  number: {
    fontSize: 44,
    fontWeight: "800",
    color: colors?.primary ?? "#6C63FF"
  },
  emoji: {
    fontSize: 34,
    marginLeft: spacing?.sm ?? 10
  },
  label: {
    marginTop: spacing?.xs ?? 6,
    textAlign: "center",
    fontSize: 18,
    color: colors?.text ?? "#2E3440",
    fontWeight: "600"
  }
});
