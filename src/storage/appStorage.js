// Local-only storage using AsyncStorage. No personal data is ever stored:
// no names, age, location, device identifiers, or behavioral tracking.
// Stores only learning stats, sticker progress, and app settings.
//
// All reads merge loaded data onto safe defaults and tolerate corrupted JSON,
// so the app never crashes because of missing or broken saved data.

import AsyncStorage from "@react-native-async-storage/async-storage";

import { createDefaultStats, normalizeStats, recordAnswer, recordCompletedGame as bumpCompletedGame } from "../utils/statsHelpers";
import { createDefaultProgress, normalizeProgress, updateUnlockedStickers } from "../utils/progressHelpers";

const STORAGE_KEY = "little_space_numbers_app_data_v1";

export function createDefaultSettings() {
  return {
    soundEnabled: true,
    defaultDifficulty: "easy",
    theme: "space"
  };
}

export function createDefaultAppData() {
  return {
    stats: createDefaultStats(),
    progress: createDefaultProgress(),
    settings: createDefaultSettings()
  };
}

function normalizeSettings(settings) {
  const base = createDefaultSettings();
  if (!settings || typeof settings !== "object") {
    return base;
  }
  const difficulty = ["easy", "medium", "hard"].includes(settings.defaultDifficulty)
    ? settings.defaultDifficulty
    : base.defaultDifficulty;
  return {
    soundEnabled: typeof settings.soundEnabled === "boolean" ? settings.soundEnabled : base.soundEnabled,
    defaultDifficulty: difficulty,
    theme: "space"
  };
}

// Merge any loaded object onto a fresh default app-data shape.
export function mergeAppData(loaded) {
  return {
    stats: normalizeStats(loaded?.stats),
    progress: normalizeProgress(loaded?.progress),
    settings: normalizeSettings(loaded?.settings)
  };
}

export async function loadAppData() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultAppData();
    }
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (parseError) {
      // Corrupted JSON -> fall back to defaults instead of crashing.
      return createDefaultAppData();
    }
    return mergeAppData(parsed);
  } catch (e) {
    return createDefaultAppData();
  }
}

export async function saveAppData(data) {
  try {
    const safe = mergeAppData(data);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
    return safe;
  } catch (e) {
    return mergeAppData(data);
  }
}

// Records a single answer and refreshes unlocked stickers, then persists.
export async function recordLearningAnswer(gameMode, isCorrect) {
  const data = await loadAppData();
  const stats = recordAnswer(data.stats, gameMode, isCorrect);
  const progress = updateUnlockedStickers(data.progress, stats);
  const next = { ...data, stats, progress };
  await saveAppData(next);
  return next;
}

export async function recordCompletedGame() {
  const data = await loadAppData();
  const stats = bumpCompletedGame(data.stats);
  const progress = updateUnlockedStickers(data.progress, stats);
  const next = { ...data, stats, progress };
  await saveAppData(next);
  return next;
}

export async function updateSettings(settings) {
  const data = await loadAppData();
  const next = {
    ...data,
    settings: normalizeSettings({ ...data.settings, ...settings })
  };
  await saveAppData(next);
  return next;
}

export async function resetLearningStats() {
  const data = await loadAppData();
  const next = { ...data, stats: createDefaultStats() };
  await saveAppData(next);
  return next;
}

export async function resetLearningProgress() {
  const data = await loadAppData();
  const next = { ...data, progress: createDefaultProgress() };
  await saveAppData(next);
  return next;
}

// Clears statistics, progress, stickers, and settings, then restores defaults.
export async function clearAllData() {
  const fresh = createDefaultAppData();
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // ignore
  }
  await saveAppData(fresh);
  return fresh;
}

export default {
  loadAppData,
  saveAppData,
  recordLearningAnswer,
  recordCompletedGame,
  updateSettings,
  resetLearningStats,
  resetLearningProgress,
  clearAllData,
  createDefaultAppData,
  createDefaultSettings
};
