import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

import ScreenContainer from "../components/ScreenContainer";
import AppButton from "../components/AppButton";
import StatCard from "../components/StatCard";
import { colors, spacing, radius } from "../theme/colors";
import { getGameModeItem, getDifficultyItem } from "../data/gameModeItems";
import { recordCompletedGame, loadAppData } from "../storage/appStorage";
import { getStickerIds } from "../utils/progressHelpers";
import { playCompleteSoundIfEnabled } from "../utils/soundHelpers";
import { getSessionCompleteAnimationConfig } from "../utils/animationHelpers";

export default function GameResultScreen({ navigation, route }) {
  const gameMode = route?.params?.gameMode ?? "count_stars";
  const difficulty = route?.params?.difficulty ?? "easy";
  const correct = route?.params?.correct ?? 0;
  const incorrect = route?.params?.incorrect ?? 0;

  const modeItem = getGameModeItem(gameMode);
  const diffItem = getDifficultyItem(difficulty);

  const [stickersUnlocked, setStickersUnlocked] = useState(0);
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Save the completed session, then read the refreshed sticker count.
    let active = true;
    recordCompletedGame()
      .then(() => loadAppData())
      .then((data) => {
        if (active) {
          setStickersUnlocked(getStickerIds(data?.progress).length);
          playCompleteSoundIfEnabled(data?.settings);
        }
      });

    const cfg = getSessionCompleteAnimationConfig();
    Animated.timing(fade, cfg).start();

    return () => {
      active = false;
    };
  }, [fade]);

  return (
    <ScreenContainer>
      <Animated.View style={{ opacity: fade }}>
        <View style={styles.hero}>
          <Text style={styles.emoji}>👨‍🚀</Text>
          <Text style={styles.title}>Space mission complete!</Text>
          <Text style={styles.subtitle}>Well done, little astronaut.</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Correct" value={correct} emoji="✅" accent={colors.success} />
          <StatCard label="Incorrect" value={incorrect} emoji="🌙" />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLine}>
            <Text style={styles.infoKey}>Game: </Text>
            {modeItem?.title ?? "Game"}
          </Text>
          <Text style={styles.infoLine}>
            <Text style={styles.infoKey}>Difficulty: </Text>
            {diffItem?.title ?? "Easy"}
          </Text>
          <Text style={styles.stickerLine}>
            🏅 Astronaut stickers unlocked: {stickersUnlocked}
          </Text>
        </View>

        <AppButton
          label="Play Again"
          onPress={() => navigation.replace("SpaceGame", { gameMode, difficulty })}
        />
        <AppButton label="Choose Game" variant="secondary" onPress={() => navigation.navigate("GamePicker")} />
        <AppButton label="My Stickers" variant="soft" onPress={() => navigation.navigate("StickerProgress")} />
        <AppButton label="Home" variant="soft" onPress={() => navigation.navigate("SpaceHome")} />
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    marginTop: spacing.md,
    marginBottom: spacing.md
  },
  emoji: {
    fontSize: 60,
    marginBottom: spacing.sm
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center"
  },
  subtitle: {
    fontSize: 16,
    color: colors.mutedText,
    marginTop: spacing.xs
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: spacing.md
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md
  },
  infoLine: {
    fontSize: 17,
    color: colors.text,
    marginVertical: 2
  },
  infoKey: {
    fontWeight: "700",
    color: colors.mutedText
  },
  stickerLine: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "600",
    marginTop: spacing.sm
  }
});
