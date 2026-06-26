// Progress helpers. Stickers are LOCAL learning progress markers only and
// have no monetary value. No coins, bonus, jackpot, or money wording.

import { getUnlockedStickers } from "../data/stickerItems";

export function createDefaultProgress() {
  return {
    unlockedStickerIds: []
  };
}

export function normalizeProgress(progress) {
  const ids = progress?.unlockedStickerIds;
  return {
    unlockedStickerIds: Array.isArray(ids) ? ids.filter((id) => typeof id === "string") : []
  };
}

// Recompute unlocked stickers from the current stats. Keeps any previously
// unlocked sticker so progress never goes backwards.
export function updateUnlockedStickers(progress, stats) {
  const current = normalizeProgress(progress);
  const earned = getUnlockedStickers(stats);
  const merged = new Set([...current.unlockedStickerIds, ...earned]);
  return {
    unlockedStickerIds: Array.from(merged)
  };
}

export function getStickerIds(progress) {
  return normalizeProgress(progress).unlockedStickerIds;
}

export function resetProgress() {
  return createDefaultProgress();
}

export default {
  createDefaultProgress,
  normalizeProgress,
  updateUnlockedStickers,
  getStickerIds,
  resetProgress
};
