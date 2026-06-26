// Safe math helpers for generating calm number questions.
// Never returns NaN, never creates duplicate answer choices.

export function getChoiceCountForDifficulty(difficulty) {
  switch (difficulty) {
    case "hard":
      return 4;
    case "medium":
      return 3;
    case "easy":
    default:
      return 2;
  }
}

export function getNumberRangeForDifficulty(difficulty) {
  switch (difficulty) {
    case "hard":
      return { min: 1, max: 20 };
    case "medium":
      return { min: 1, max: 10 };
    case "easy":
    default:
      return { min: 1, max: 5 };
  }
}

export function shuffleArray(items) {
  const arr = Array.isArray(items) ? [...items] : [];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function clampInt(value, min, max) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return min;
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

// Builds a set of unique numeric choices that always includes the correct
// answer. `maxValue` bounds the highest distractor that may be generated.
export function createNumberChoices(correctAnswer, difficulty, maxValue) {
  const count = getChoiceCountForDifficulty(difficulty);
  const correct = clampInt(correctAnswer, 0, 999);
  const ceiling = Math.max(clampInt(maxValue, 1, 20), correct, count);

  const choices = new Set([correct]);

  // Try nearby numbers first so distractors feel natural, then widen.
  let guard = 0;
  while (choices.size < count && guard < 200) {
    guard += 1;
    const candidate = Math.floor(Math.random() * (ceiling + 1)); // 0..ceiling
    if (candidate >= 0 && candidate <= ceiling) {
      choices.add(candidate);
    }
  }

  // Deterministic fallback in the unlikely event randomness can't fill the set.
  let filler = 0;
  while (choices.size < count && filler <= ceiling + count) {
    choices.add(filler);
    filler += 1;
  }

  return shuffleArray(Array.from(choices));
}

// Builds an array describing visual objects to render, e.g. [{id, objectType}].
export function createCountingObjects(count, objectType) {
  const safeCount = clampInt(count, 0, 20);
  const type = typeof objectType === "string" ? objectType : "star";
  return Array.from({ length: safeCount }, (_, i) => ({
    id: `${type}_${i}`,
    objectType: type
  }));
}

export function isCorrectAnswer(selectedValue, correctValue) {
  return Number(selectedValue) === Number(correctValue);
}

export default {
  getChoiceCountForDifficulty,
  getNumberRangeForDifficulty,
  createNumberChoices,
  createCountingObjects,
  shuffleArray,
  isCorrectAnswer
};
