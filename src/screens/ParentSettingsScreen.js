import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, Switch, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import ScreenContainer from "../components/ScreenContainer";
import AppButton from "../components/AppButton";
import DifficultyChip from "../components/DifficultyChip";
import { colors, spacing, radius } from "../theme/colors";
import { DIFFICULTY_ITEMS } from "../data/gameModeItems";
import { loadAppData, updateSettings, clearAllData, createDefaultSettings } from "../storage/appStorage";

export default function ParentSettingsScreen({ navigation }) {
  const [settings, setSettings] = useState(createDefaultSettings());

  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadAppData().then((data) => {
        if (active) setSettings(data?.settings ?? createDefaultSettings());
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const soundEnabled = settings?.soundEnabled ?? true;
  const defaultDifficulty = settings?.defaultDifficulty ?? "easy";

  const toggleSound = async (value) => {
    setSettings((s) => ({ ...s, soundEnabled: value }));
    await updateSettings({ soundEnabled: value });
  };

  const chooseDifficulty = async (key) => {
    setSettings((s) => ({ ...s, defaultDifficulty: key }));
    await updateSettings({ defaultDifficulty: key });
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to delete all local space number progress?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            const fresh = await clearAllData();
            setSettings(fresh?.settings ?? createDefaultSettings());
          }
        }
      ]
    );
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Parent Settings</Text>

      <Section title="Sound">
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>{soundEnabled ? "On" : "Off"}</Text>
          <Switch
            value={soundEnabled}
            onValueChange={toggleSound}
            trackColor={{ true: colors.secondary, false: colors.border }}
            thumbColor="#FFFFFF"
          />
        </View>
        <Text style={styles.help}>
          Gentle correct-answer sounds can be turned off anytime.
        </Text>
      </Section>

      <Section title="Default Difficulty">
        <View style={styles.chips}>
          {DIFFICULTY_ITEMS.map((diff) => (
            <DifficultyChip
              key={diff.key}
              title={diff.title}
              selected={defaultDifficulty === diff.key}
              onPress={() => chooseDifficulty(diff.key)}
            />
          ))}
        </View>
      </Section>

      <Section title="Session Length">
        <Text style={styles.help}>Each game session has 5 calm questions.</Text>
      </Section>

      <Section title="Theme">
        <Text style={styles.help}>
          Little Space Numbers uses a soft child-friendly space theme.
        </Text>
      </Section>

      <Section title="Sticker Progress">
        <Text style={styles.help}>
          Astronaut stickers are simple learning markers inside the app. They have no money value.
        </Text>
      </Section>

      <Section title="Privacy Note">
        <Text style={styles.help}>
          Little Space Numbers does not collect personal data. The app works offline and stores
          learning progress, stickers, statistics, and settings only on this device.
        </Text>
      </Section>

      <Section title="Child-Friendly Note">
        <Text style={styles.help}>
          There are no ads, purchases, accounts, internet access, social sharing, leaderboards,
          coins, bonuses, jackpots, or real money rewards.
        </Text>
      </Section>

      <AppButton label="Clear All Data" variant="danger" onPress={handleClearAll} />
      <AppButton label="Back Home" variant="soft" onPress={() => navigation.navigate("SpaceHome")} />
    </ScreenContainer>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
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
  section: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  switchLabel: {
    fontSize: 17,
    color: colors.text,
    fontWeight: "600"
  },
  help: {
    fontSize: 14,
    color: colors.mutedText,
    marginTop: spacing.xs,
    lineHeight: 20
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap"
  }
});
