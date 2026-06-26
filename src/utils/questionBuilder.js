// Builds one calm number question at a time. No timer logic.
// Guarantees: valid question object, choices include the correct answer,
// no duplicate choices, addition result <= 10, subtraction result >= 0,
// bigger-number choices never equal.

import {
  getChoiceCountForDifficulty,
  getNumberRangeForDifficulty,
  createNumberChoices,
  shuffleArray
} from "./spaceMathHelpers";

let questionCounter = 0;
function nextId() {
  questionCounter += 1;
  return `question_${Date.now()}_${questionCounter}`;
}

function randInt(min, max) {
  const lo = Math.ceil(min);
  const hi = Math.floor(max);
  if (hi < lo) return lo;
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

const COUNT_PROMPTS = {
  star: "How many stars?",
  planet: "Count the planets.",
  rocket: "Count the rockets."
};

export function buildCountStarsQuestion(difficulty) {
  const range = getNumberRangeForDifficulty(difficulty);
  // Rotate the counted object so the mode stays visually varied.
  const objectTypes = ["star", "planet", "rocket"];
  const objectType = objectTypes[randInt(0, objectTypes.length - 1)];
  const count = randInt(1, range.max);
  const choices = createNumberChoices(count, difficulty, range.max);
  return {
    id: nextId(),
    gameMode: "count_stars",
    difficulty,
    prompt: COUNT_PROMPTS[objectType] ?? COUNT_PROMPTS.star,
    correctAnswer: count,
    choices,
    visual: {
      type: "count",
      objectType,
      count
    }
  };
}

export function buildBiggerNumberQuestion(difficulty) {
  const range = getNumberRangeForDifficulty(difficulty);
  const choiceCount = getChoiceCountForDifficulty(difficulty);

  // Collect distinct numbers; never equal. The biggest is the correct answer.
  const pool = new Set();
  let guard = 0;
  const span = Math.max(range.max - range.min + 1, choiceCount);
  while (pool.size < choiceCount && guard < 200) {
    guard += 1;
    pool.add(randInt(range.min, range.max));
  }
  // Deterministic fill if needed (still distinct).
  let filler = range.min;
  while (pool.size < choiceCount && filler <= range.max) {
    pool.add(filler);
    filler += 1;
  }

  const numbers = Array.from(pool);
  const correctAnswer = Math.max(...numbers);

  return {
    id: nextId(),
    gameMode: "bigger_number",
    difficulty,
    prompt: "Choose the bigger number.",
    correctAnswer,
    choices: shuffleArray(numbers),
    visual: {
      type: "compare",
      numbers: shuffleArray(numbers)
    }
  };
}

export function buildAdditionQuestion(difficulty) {
  // Result must be 10 or less. Use small, friendly groups.
  const maxResult = difficulty === "easy" ? 5 : 10;
  const left = randInt(1, Math.max(1, maxResult - 1));
  const right = randInt(1, Math.max(1, maxResult - left));
  const correctAnswer = left + right; // always <= maxResult <= 10
  const choices = createNumberChoices(correctAnswer, difficulty, maxResult);
  return {
    id: nextId(),
    gameMode: "add_stars",
    difficulty,
    prompt: "How many stars together?",
    correctAnswer,
    choices,
    visual: {
      type: "addition",
      objectType: "star",
      left,
      right
    }
  };
}

export function buildSubtractionQuestion(difficulty) {
  // Start number must be 10 or less. Result must never be negative.
  const maxStart = difficulty === "easy" ? 5 : 10;
  const start = randInt(2, maxStart);
  const takeAway = randInt(1, start); // result >= 0
  const correctAnswer = start - takeAway;
  const choices = createNumberChoices(correctAnswer, difficulty, maxStart);
  return {
    id: nextId(),
    gameMode: "subtract_rockets",
    difficulty,
    prompt: "How many rockets are left?",
    correctAnswer,
    choices,
    visual: {
      type: "subtraction",
      objectType: "rocket",
      start,
      takeAway
    }
  };
}

// Main entry. Always returns a valid question, even for unknown input.
export function buildSpaceQuestion(gameMode, difficulty) {
  const mode = typeof gameMode === "string" ? gameMode : "count_stars";
  const diff = ["easy", "medium", "hard"].includes(difficulty)
    ? difficulty
    : "easy";

  switch (mode) {
    case "bigger_number":
      return buildBiggerNumberQuestion(diff);
    case "add_stars":
      return buildAdditionQuestion(diff);
    case "subtract_rockets":
      return buildSubtractionQuestion(diff);
    case "count_stars":
    default:
      return buildCountStarsQuestion(diff);
  }
}

export default buildSpaceQuestion;
