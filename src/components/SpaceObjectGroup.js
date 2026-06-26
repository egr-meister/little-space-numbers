import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { createCountingObjects } from "../utils/spaceMathHelpers";

const EMOJI_BY_TYPE = {
  star: "⭐",
  planet: "🪐",
  rocket: "🚀"
};

// Renders a simple static group of space objects (stars / planets / rockets).
// No animation, no external images — just friendly emoji laid out in a wrap.
export default function SpaceObjectGroup({ count = 0, objectType = "star", size = 40 }) {
  const items = createCountingObjects(count, objectType);
  const emoji = EMOJI_BY_TYPE[objectType] ?? EMOJI_BY_TYPE.star;

  if (items.length === 0) {
    return (
      <View style={styles.wrap}>
        <Text style={[styles.emoji, { fontSize: size }]}>·</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      {items.map((item) => (
        <Text
          key={item?.id ?? Math.random().toString()}
          style={[styles.emoji, { fontSize: size }]}
          accessibilityLabel={objectType}
        >
          {emoji}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center"
  },
  emoji: {
    margin: 6
  }
});
