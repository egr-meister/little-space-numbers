import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import ScreenContainer from "../components/ScreenContainer";
import AppButton from "../components/AppButton";
import GameModeCard from "../components/GameModeCard";
import DifficultyChip from "../components/DifficultyChip";
import { colors, spacing } from "../theme/colors";
import { GAME_MODE_ITEMS, DIFFICULTY_ITEMS } from "../data/gameModeItems";
import { loadAppData } from "../storage/appStorage";

export default function GamePickerScreen({ navigation }) {
  const [gameMode, setGameMode] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [error, setError] = useState("");

  // Pre-select the parent's default difficulty when arriving on this screen.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadAppData().then((data) => {
        if (active && !difficulty) {
          setDifficulty(data?.settings?.defaultDifficulty ?? "easy");
        }
      });
      return () => {
        active = false;
      };
    }, [difficulty])
  );

  const handleStart = () => {
    if (!gameMode) {
      setError("Please choose a game.");
      return;
    }
    if (!difficulty) {
      setError("Please choose a difficulty.");
      return;
    }
    setError("");
    navigation.navigate("SpaceGame", { gameMode, difficulty });
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Choose a Game</Text>
      <Text style={styles.subtitle}>Pick a game and a difficulty.</Text>

      <View style={styles.section}>
        {GAME_MODE_ITEMS.map((mode) => (
          <GameModeCard
            key={mode.key}
            title={mode.title}
            description={mode.description}
            emoji={mode.emoji}
            selected={gameMode === mode.key}
            onPress={() => {
              setGameMode(mode.key);
              setError("");
            }}
          />
        ))}
      </View>

      <Text style={styles.sectionLabel}>Difficulty</Text>
      <View style={styles.chips}>
        {DIFFICULTY_ITEMS.map((diff) => (
          <DifficultyChip
            key={diff.key}
            title={diff.title}
            selected={difficulty === diff.key}
            onPress={() => {
              setDifficulty(diff.key);
              setError("");
            }}
          />
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <AppButton label="Start Game" onPress={handleStart} />
      <AppButton label="Back" variant="soft" onPress={() => navigation.goBack()} />
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
  section: {
    marginBottom: spacing.md
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: spacing.md
  },
  error: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: spacing.sm
  }
});
