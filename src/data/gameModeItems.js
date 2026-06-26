// Game modes and difficulty descriptors for Little Space Numbers.

export const GAME_MODE_ITEMS = [
  {
    key: "count_stars",
    title: "Count the Stars",
    description: "Count the space objects.",
    emoji: "⭐",
    objectType: "star"
  },
  {
    key: "bigger_number",
    title: "Choose Bigger Number",
    description: "Choose the bigger number.",
    emoji: "🪐",
    objectType: "planet"
  },
  {
    key: "add_stars",
    title: "Add with Stars",
    description: "Add simple space objects.",
    emoji: "✨",
    objectType: "star"
  },
  {
    key: "subtract_rockets",
    title: "Subtract with Rockets",
    description: "Take away rockets and choose the answer.",
    emoji: "🚀",
    objectType: "rocket"
  }
];

export const DIFFICULTY_ITEMS = [
  {
    key: "easy",
    title: "Easy",
    description: "Numbers 1–5, 2 choices.",
    maxNumber: 5,
    choiceCount: 2
  },
  {
    key: "medium",
    title: "Medium",
    description: "Numbers 1–10, 3 choices.",
    maxNumber: 10,
    choiceCount: 3
  },
  {
    key: "hard",
    title: "Hard",
    description: "Numbers 1–20, 4 choices.",
    maxNumber: 20,
    choiceCount: 4
  }
];

const DEFAULT_GAME_MODE = GAME_MODE_ITEMS[0];
const DEFAULT_DIFFICULTY = DIFFICULTY_ITEMS[0];

export function getGameModeItem(gameMode) {
  const found = GAME_MODE_ITEMS.find((item) => item.key === gameMode);
  return found ?? DEFAULT_GAME_MODE;
}

export function getDifficultyItem(difficulty) {
  const found = DIFFICULTY_ITEMS.find((item) => item.key === difficulty);
  return found ?? DEFAULT_DIFFICULTY;
}

export default GAME_MODE_ITEMS;
