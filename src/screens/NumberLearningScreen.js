import React from "react";
import { View, Text, StyleSheet } from "react-native";

import ScreenContainer from "../components/ScreenContainer";
import AppButton from "../components/AppButton";
import NumberCard from "../components/NumberCard";
import { colors, spacing } from "../theme/colors";
import { NUMBER_ITEMS } from "../data/numberItems";

function labelFor(item) {
  // e.g. "1 — one star", "2 — two planets", "3 — three rockets"
  const value = item?.value ?? 1;
  const noun = item?.noun ?? "star";
  const plural = value === 1 ? noun : `${noun}s`;
  const word = NUMBER_WORDS[value] ?? String(value);
  return `${value} — ${word} ${plural}`;
}

const NUMBER_WORDS = {
  1: "one", 2: "two", 3: "three", 4: "four", 5: "five",
  6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten",
  11: "eleven", 12: "twelve", 13: "thirteen", 14: "fourteen", 15: "fifteen",
  16: "sixteen", 17: "seventeen", 18: "eighteen", 19: "nineteen", 20: "twenty"
};

export default function NumberLearningScreen({ navigation }) {
  const items = Array.isArray(NUMBER_ITEMS) ? NUMBER_ITEMS : [];

  return (
    <ScreenContainer>
      <Text style={styles.title}>Learn the Numbers</Text>
      <Text style={styles.subtitle}>
        Tap through 1 to 20 and count the space objects.
      </Text>

      <View style={styles.list}>
        {items.map((item) => (
          <NumberCard
            key={item?.value ?? Math.random().toString()}
            number={item?.value}
            objectType={item?.objectType}
            emoji={item?.emoji}
            label={labelFor(item)}
          />
        ))}
      </View>

      <AppButton label="Play" onPress={() => navigation.navigate("GamePicker")} />
      <AppButton label="Back Home" variant="soft" onPress={() => navigation.navigate("SpaceHome")} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center"
  },
  subtitle: {
    fontSize: 16,
    color: colors.mutedText,
    textAlign: "center",
    marginTop: spacing.xs,
    marginBottom: spacing.md
  },
  list: {
    marginBottom: spacing.md
  }
});
