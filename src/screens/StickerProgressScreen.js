import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import ScreenContainer from "../components/ScreenContainer";
import AppButton from "../components/AppButton";
import StatCard from "../components/StatCard";
import AstronautSticker from "../components/AstronautSticker";
import EmptyState from "../components/EmptyState";
import { colors, spacing, radius } from "../theme/colors";
import { STICKER_ITEMS } from "../data/stickerItems";
import { GAME_MODE_ITEMS } from "../data/gameModeItems";
import { loadAppData, resetLearningStats, resetLearningProgress, createDefaultAppData } from "../storage/appStorage";
import { getTotalCorrect, getTotalIncorrect, getTotalAnswered } from "../utils/statsHelpers";
import { getStickerIds } from "../utils/progressHelpers";

export default function StickerProgressScreen({ navigation }) {
  const [data, setData] = useState(createDefaultAppData());

  const refresh = useCallback(() => {
    let active = true;
    loadAppData().then((loaded) => {
      if (active) setData(loaded ?? createDefaultAppData());
    });
    return () => {
      active = false;
    };
  }, []);

  useFocusEffect(refresh);

  const stats = data?.stats;
  const correct = getTotalCorrect(stats);
  const incorrect = getTotalIncorrect(stats);
  const total = getTotalAnswered(stats);
  const completedGames = stats?.completedGames ?? 0;
  const unlockedIds = getStickerIds(data?.progress);
  const hasProgress = total + completedGames + unlockedIds.length > 0;

  const handleReset = () => {
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to reset space number progress?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await resetLearningStats();
            await resetLearningProgress();
            const fresh = await loadAppData();
            setData(fresh ?? createDefaultAppData());
          }
        }
      ]
    );
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Stickers & Progress</Text>

      {!hasProgress ? (
        <EmptyState emoji="🌙" title="No stickers yet" message="No space number progress yet." />
      ) : (
        <>
          <View style={styles.statsRow}>
            <StatCard label="Correct" value={correct} emoji="✅" accent={colors.success} />
            <StatCard label="Incorrect" value={incorrect} emoji="🌙" />
            <StatCard label="Total" value={total} emoji="🔢" />
            <StatCard label="Games" value={completedGames} emoji="🚀" />
            <StatCard label="Stickers" value={unlockedIds.length} emoji="🏅" accent={colors.accent} />
          </View>

          <Text style={styles.sectionLabel}>By Game</Text>
          <View style={styles.byModeCard}>
            {GAME_MODE_ITEMS.map((mode) => {
              const m = stats?.byGameMode?.[mode.key] ?? { correct: 0, incorrect: 0 };
              return (
                <View key={mode.key} style={styles.byModeRow}>
                  <Text style={styles.byModeTitle}>
                    {mode.emoji} {mode.title}
                  </Text>
                  <Text style={styles.byModeStat}>
                    ✅ {m?.correct ?? 0}   🌙 {m?.incorrect ?? 0}
                  </Text>
                </View>
              );
            })}
          </View>
        </>
      )}

      <Text style={styles.sectionLabel}>Astronaut Stickers</Text>
      {STICKER_ITEMS.map((sticker) => (
        <AstronautSticker
          key={sticker.id}
          title={sticker.title}
          emoji={sticker.emoji}
          description={sticker.description}
          unlocked={unlockedIds.includes(sticker.id)}
        />
      ))}

      <Text style={styles.note}>
        Astronaut stickers are simple learning markers inside the app. They have no money value.
      </Text>

      <AppButton label="Reset Progress" variant="danger" onPress={handleReset} />
      <AppButton label="Back Home" variant="soft" onPress={() => navigation.navigate("SpaceHome")} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center",
    marginBottom: spacing.md
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: spacing.md
  },
  sectionLabel: {
    fontSize: 19,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.xs
  },
  byModeCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm
  },
  byModeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6
  },
  byModeTitle: {
    fontSize: 15,
    color: colors.text,
    fontWeight: "600",
    flex: 1
  },
  byModeStat: {
    fontSize: 15,
    color: colors.mutedText,
    fontWeight: "600"
  },
  note: {
    fontSize: 14,
    color: colors.mutedText,
    textAlign: "center",
    marginVertical: spacing.md
  }
});
