// Learning statistics helpers. Pure functions that never mutate input
// and never return NaN. Always safe with missing nested values.

const GAME_MODE_KEYS = [
  "count_stars",
  "bigger_number",
  "add_stars",
  "subtract_rockets"
];

export function createDefaultStats() {
  const byGameMode = {};
  GAME_MODE_KEYS.forEach((key) => {
    byGameMode[key] = { correct: 0, incorrect: 0 };
  });
  return {
    correct: 0,
    incorrect: 0,
    completedGames: 0,
    byGameMode
  };
}

function safeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

// Merge any loaded/partial stats object onto a fresh default.
export function normalizeStats(stats) {
  const base = createDefaultStats();
  if (!stats || typeof stats !== "object") {
    return base;
  }
  const merged = {
    correct: safeNumber(stats.correct),
    incorrect: safeNumber(stats.incorrect),
    completedGames: safeNumber(stats.completedGames),
    byGameMode: { ...base.byGameMode }
  };
  GAME_MODE_KEYS.forEach((key) => {
    const m = stats?.byGameMode?.[key];
    merged.byGameMode[key] = {
      correct: safeNumber(m?.correct),
      incorrect: safeNumber(m?.incorrect)
    };
  });
  return merged;
}

export function recordAnswer(stats, gameMode, isCorrect) {
  const next = normalizeStats(stats);
  const mode = GAME_MODE_KEYS.includes(gameMode) ? gameMode : "count_stars";
  if (isCorrect) {
    next.correct += 1;
    next.byGameMode[mode].correct += 1;
  } else {
    next.incorrect += 1;
    next.byGameMode[mode].incorrect += 1;
  }
  return next;
}

export function recordCompletedGame(stats) {
  const next = normalizeStats(stats);
  next.completedGames += 1;
  return next;
}

export function getTotalCorrect(stats) {
  return safeNumber(stats?.correct);
}

export function getTotalIncorrect(stats) {
  return safeNumber(stats?.incorrect);
}

export function getTotalAnswered(stats) {
  return getTotalCorrect(stats) + getTotalIncorrect(stats);
}

export function resetStats() {
  return createDefaultStats();
}

export default {
  createDefaultStats,
  normalizeStats,
  recordAnswer,
  recordCompletedGame,
  getTotalCorrect,
  getTotalIncorrect,
  getTotalAnswered,
  resetStats
};
