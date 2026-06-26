// Static number items 1..20 for the soft space counting theme.
// Object types rotate through star / planet / rocket so each number
// has a friendly space object attached to it.

const OBJECT_CYCLE = [
  { objectType: "star", emoji: "⭐", noun: "star" },
  { objectType: "planet", emoji: "🪐", noun: "planet" },
  { objectType: "rocket", emoji: "🚀", noun: "rocket" }
];

function buildItem(value) {
  const cycle = OBJECT_CYCLE[(value - 1) % OBJECT_CYCLE.length];
  return {
    value,
    label: String(value),
    objectType: cycle.objectType,
    emoji: cycle.emoji,
    noun: cycle.noun
  };
}

export const NUMBER_ITEMS = Array.from({ length: 20 }, (_, i) => buildItem(i + 1));

const SAFE_DEFAULT = NUMBER_ITEMS[0];

// Always returns a valid item. Falls back to "1" for invalid input.
export function getNumberItem(number) {
  const n = Number(number);
  if (!Number.isFinite(n)) {
    return SAFE_DEFAULT;
  }
  const found = NUMBER_ITEMS.find((item) => item.value === n);
  return found ?? SAFE_DEFAULT;
}

export function getMaxNumberForDifficulty(difficulty) {
  switch (difficulty) {
    case "hard":
      return 20;
    case "medium":
      return 10;
    case "easy":
    default:
      return 5;
  }
}

export function getNumbersForDifficulty(difficulty) {
  const max = getMaxNumberForDifficulty(difficulty);
  return NUMBER_ITEMS.filter((item) => item.value <= max);
}

export default NUMBER_ITEMS;
