// Astronaut stickers are LOCAL learning progress markers only.
// They have no monetary value. No coins, bonus, jackpot, or money wording.

export const STICKER_ITEMS = [
  {
    id: "first_star",
    title: "First Star Sticker",
    emoji: "⭐",
    description: "Answer 1 question correctly.",
    isUnlocked: (stats) => totalCorrect(stats) >= 1
  },
  {
    id: "rocket_counter",
    title: "Rocket Counter Sticker",
    emoji: "🔢",
    description: "Answer 5 Count the Stars questions correctly.",
    isUnlocked: (stats) => modeCorrect(stats, "count_stars") >= 5
  },
  {
    id: "big_number",
    title: "Big Number Sticker",
    emoji: "🪐",
    description: "Answer 5 Bigger Number questions correctly.",
    isUnlocked: (stats) => modeCorrect(stats, "bigger_number") >= 5
  },
  {
    id: "star_addition",
    title: "Star Addition Sticker",
    emoji: "✨",
    description: "Answer 5 Add with Stars questions correctly.",
    isUnlocked: (stats) => modeCorrect(stats, "add_stars") >= 5
  },
  {
    id: "rocket_subtraction",
    title: "Rocket Subtraction Sticker",
    emoji: "🚀",
    description: "Answer 5 Subtract with Rockets questions correctly.",
    isUnlocked: (stats) => modeCorrect(stats, "subtract_rockets") >= 5
  },
  {
    id: "little_astronaut",
    title: "Little Astronaut Sticker",
    emoji: "👨‍🚀",
    description: "Answer 25 questions correctly.",
    isUnlocked: (stats) => totalCorrect(stats) >= 25
  }
];

function totalCorrect(stats) {
  return Number(stats?.correct ?? 0) || 0;
}

function modeCorrect(stats, mode) {
  return Number(stats?.byGameMode?.[mode]?.correct ?? 0) || 0;
}

// Returns the list of sticker ids that the given stats have unlocked.
export function getUnlockedStickers(stats) {
  return STICKER_ITEMS.filter((sticker) => {
    try {
      return sticker.isUnlocked(stats);
    } catch (e) {
      return false;
    }
  }).map((sticker) => sticker.id);
}

export function getStickerItem(stickerId) {
  return STICKER_ITEMS.find((s) => s.id === stickerId) ?? null;
}

export default STICKER_ITEMS;
