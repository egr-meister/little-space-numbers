import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import ScreenContainer from "../components/ScreenContainer";
import AppButton from "../components/AppButton";
import StatCard from "../components/StatCard";
import EmptyState from "../components/EmptyState";
import { colors, spacing } from "../theme/colors";
import { loadAppData, createDefaultAppData } from "../storage/appStorage";
import { getTotalCorrect, getTotalIncorrect } from "../utils/statsHelpers";
import { getStickerIds } from "../utils/progressHelpers";

export default function SpaceHomeScreen({ navigation }) {
  const [data, setData] = useState(createDefaultAppData());

  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadAppData().then((loaded) => {
        if (active) setData(loaded ?? createDefaultAppData());
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const stats = data?.stats;
  const correct = getTotalCorrect(stats);
  const incorrect = getTotalIncorrect(stats);
  const completedGames = stats?.completedGames ?? 0;
  const stickersUnlocked = getStickerIds(data?.progress).length;
  const hasProgress = correct + incorrect + completedGames + stickersUnlocked > 0;

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <Text style={styles.rocket}>🚀</Text>
        <Text style={styles.title}>Little Space Numbers</Text>
        <Text style={styles.subtitle}>Count stars, planets, and rockets.</Text>
      </View>

      {hasProgress ? (
        <View style={styles.statsRow}>
          <StatCard label="Correct" value={correct} emoji="✅" accent={colors.success} />
          <StatCard label="Incorrect" value={incorrect} emoji="🌙" />
          <StatCard label="Games" value={completedGames} emoji="🚀" />
          <StatCard label="Stickers" value={stickersUnlocked} emoji="🏅" accent={colors.accent} />
        </View>
      ) : (
        <EmptyState
          emoji="⭐"
          title="Ready for take-off"
          message="Start counting space objects."
        />
      )}

      <View style={styles.actions}>
        <AppButton label="Start Learning" onPress={() => navigation.navigate("NumberLearning")} />
        <AppButton label="Play Number Games" variant="secondary" onPress={() => navigation.navigate("GamePicker")} />
        <AppButton label="My Stickers" variant="soft" onPress={() => navigation.navigate("StickerProgress")} />
        <AppButton label="Parent Settings" variant="soft" onPress={() => navigation.navigate("ParentSettings")} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.lg
  },
  rocket: {
    fontSize: 64,
    marginBottom: spacing.sm
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center"
  },
  subtitle: {
    fontSize: 17,
    color: colors.mutedText,
    textAlign: "center",
    marginTop: spacing.xs
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: spacing.md
  },
  actions: {
    marginTop: spacing.md
  }
});
