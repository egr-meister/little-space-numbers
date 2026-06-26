import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

import ScreenContainer from "../components/ScreenContainer";
import AppButton from "../components/AppButton";
import AnswerCard from "../components/AnswerCard";
import SpaceObjectGroup from "../components/SpaceObjectGroup";
import { colors, spacing, radius } from "../theme/colors";
import { getGameModeItem, getDifficultyItem } from "../data/gameModeItems";
import { buildSpaceQuestion } from "../utils/questionBuilder";
import { isCorrectAnswer } from "../utils/spaceMathHelpers";
import { recordLearningAnswer, loadAppData } from "../storage/appStorage";
import { playCorrectSoundIfEnabled } from "../utils/soundHelpers";
import { getCorrectAnswerAnimationConfig } from "../utils/animationHelpers";
import { activateGameKeepAwake, deactivateGameKeepAwake } from "../utils/immersiveHelpers";

const SESSION_LENGTH = 5;

const ENCOURAGEMENTS = [
  "Take your time.",
  "Count carefully.",
  "Look at the stars.",
  "You are doing well."
];

export default function SpaceGameScreen({ navigation, route }) {
  const gameMode = route?.params?.gameMode ?? "count_stars";
  const difficulty = route?.params?.difficulty ?? "easy";
  const modeItem = getGameModeItem(gameMode);
  const diffItem = getDifficultyItem(difficulty);

  const [questionIndex, setQuestionIndex] = useState(0); // 0..SESSION_LENGTH-1
  const [question, setQuestion] = useState(() => buildSpaceQuestion(gameMode, difficulty));
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionIncorrect, setSessionIncorrect] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const popValue = useRef(new Animated.Value(1)).current;

  // Keep awake ONLY on this active game screen. Always released on unmount.
  useEffect(() => {
    activateGameKeepAwake();
    return () => {
      deactivateGameKeepAwake();
    };
  }, []);

  // Load the sound setting once.
  useEffect(() => {
    let active = true;
    loadAppData().then((data) => {
      if (active) setSoundEnabled(data?.settings?.soundEnabled ?? true);
    });
    return () => {
      active = false;
    };
  }, []);

  const choices = question?.choices ?? [];
  const correctAnswer = question?.correctAnswer ?? 0;
  const encouragement = ENCOURAGEMENTS[questionIndex % ENCOURAGEMENTS.length];

  const handleAnswer = useCallback(
    (value) => {
      if (answered) return;
      const correct = isCorrectAnswer(value, correctAnswer);
      setSelected(value);
      setAnswered(true);

      if (correct) {
        setSessionCorrect((n) => n + 1);
        playCorrectSoundIfEnabled({ soundEnabled });
        const cfg = getCorrectAnswerAnimationConfig();
        popValue.setValue(0.9);
        Animated.spring(popValue, cfg).start();
      } else {
        setSessionIncorrect((n) => n + 1);
      }

      // Persist locally (also refreshes stickers).
      recordLearningAnswer(gameMode, correct);
    },
    [answered, correctAnswer, gameMode, popValue, soundEnabled]
  );

  const handleContinue = () => {
    const nextIndex = questionIndex + 1;
    if (nextIndex >= SESSION_LENGTH) {
      navigation.replace("GameResult", {
        gameMode,
        difficulty,
        correct: sessionCorrect,
        incorrect: sessionIncorrect
      });
      return;
    }
    setQuestionIndex(nextIndex);
    setQuestion(buildSpaceQuestion(gameMode, difficulty));
    setSelected(null);
    setAnswered(false);
    popValue.setValue(1);
  };

  const isCorrect = answered && isCorrectAnswer(selected, correctAnswer);

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <Text style={styles.badge}>{modeItem?.title ?? "Game"}</Text>
        <Text style={styles.badgeSoft}>{diffItem?.title ?? "Easy"}</Text>
      </View>

      <Text style={styles.progressText}>
        Question {Math.min(questionIndex + 1, SESSION_LENGTH)} of {SESSION_LENGTH}
      </Text>

      <Text style={styles.prompt}>{question?.prompt ?? "How many stars?"}</Text>

      <Animated.View style={[styles.visualBox, { transform: [{ scale: popValue }] }]}>
        <QuestionVisual visual={question?.visual} />
      </Animated.View>

      {!answered ? (
        <Text style={styles.encourage}>{encouragement}</Text>
      ) : (
        <Text style={[styles.feedback, isCorrect ? styles.feedbackGood : styles.feedbackSoft]}>
          {isCorrect ? "Great counting!" : `Good try. The answer was: ${correctAnswer}.`}
        </Text>
      )}

      <View style={styles.answers}>
        {choices.map((choice, idx) => {
          let state = "idle";
          if (answered) {
            if (isCorrectAnswer(choice, correctAnswer)) state = "correct";
            else if (choice === selected) state = "wrong";
            else state = "muted";
          }
          return (
            <AnswerCard
              key={`${choice}_${idx}`}
              value={choice}
              state={state}
              disabled={answered}
              onPress={() => handleAnswer(choice)}
            />
          );
        })}
      </View>

      {answered ? (
        <AppButton
          label={questionIndex + 1 >= SESSION_LENGTH ? "See My Mission" : "Next"}
          onPress={handleContinue}
        />
      ) : null}

      <AppButton
        label="Leave Game"
        variant="soft"
        onPress={() => navigation.navigate("SpaceHome")}
      />
    </ScreenContainer>
  );
}

// Renders the visual part of a question based on its type.
function QuestionVisual({ visual }) {
  const type = visual?.type;

  if (type === "addition") {
    return (
      <View style={styles.row}>
        <SpaceObjectGroup count={visual?.left ?? 0} objectType={visual?.objectType ?? "star"} size={34} />
        <Text style={styles.operator}>+</Text>
        <SpaceObjectGroup count={visual?.right ?? 0} objectType={visual?.objectType ?? "star"} size={34} />
      </View>
    );
  }

  if (type === "subtraction") {
    const start = visual?.start ?? 0;
    const takeAway = visual?.takeAway ?? 0;
    const remaining = Math.max(start - takeAway, 0);
    return (
      <View>
        <Text style={styles.subLabel}>Start with {start} rockets</Text>
        <SpaceObjectGroup count={start} objectType="rocket" size={32} />
        <Text style={styles.subLabel}>Take away {takeAway} 🚀</Text>
        <View style={styles.divider} />
        <Text style={styles.subLabel}>Rockets left:</Text>
        <SpaceObjectGroup count={remaining} objectType="rocket" size={32} />
      </View>
    );
  }

  if (type === "compare") {
    const numbers = Array.isArray(visual?.numbers) ? visual.numbers : [];
    return (
      <View style={styles.row}>
        {numbers.map((n, i) => (
          <Text key={`${n}_${i}`} style={styles.compareNumber}>
            {n}
          </Text>
        ))}
      </View>
    );
  }

  // Default: counting
  return (
    <SpaceObjectGroup count={visual?.count ?? 0} objectType={visual?.objectType ?? "star"} size={36} />
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: spacing.xs
  },
  badge: {
    backgroundColor: colors.primary,
    color: "#FFFFFF",
    fontWeight: "700",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    overflow: "hidden",
    margin: 4,
    fontSize: 14
  },
  badgeSoft: {
    backgroundColor: colors.secondary,
    color: "#FFFFFF",
    fontWeight: "700",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    overflow: "hidden",
    margin: 4,
    fontSize: 14
  },
  progressText: {
    textAlign: "center",
    color: colors.mutedText,
    fontSize: 14,
    marginBottom: spacing.sm
  },
  prompt: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.md
  },
  visualBox: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  operator: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.primary,
    marginHorizontal: spacing.sm
  },
  compareNumber: {
    fontSize: 56,
    fontWeight: "800",
    color: colors.primary,
    marginHorizontal: spacing.md
  },
  subLabel: {
    textAlign: "center",
    fontSize: 16,
    color: colors.text,
    fontWeight: "600",
    marginVertical: 4
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm
  },
  encourage: {
    textAlign: "center",
    fontSize: 16,
    color: colors.mutedText,
    marginBottom: spacing.sm
  },
  feedback: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.sm
  },
  feedbackGood: {
    color: colors.success
  },
  feedbackSoft: {
    color: colors.primary
  },
  answers: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: spacing.md
  }
});
