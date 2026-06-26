// Gentle sound feedback helpers.
//
// To keep the app lightweight, fully offline, and free of any permission
// requests (no microphone, no heavy audio libraries), sound is implemented as
// a safe no-op that simply respects the user's setting. Visual feedback always
// works regardless. These functions never throw.

function soundEnabled(settings) {
  return settings?.soundEnabled ?? true;
}

export function playCorrectSoundIfEnabled(settings) {
  try {
    if (!soundEnabled(settings)) {
      return false;
    }
    // No audio library is bundled (keeps the app permission-free and tiny).
    // Visual encouragement is shown on screen instead. Safe no-op.
    return true;
  } catch (e) {
    return false;
  }
}

export function playCompleteSoundIfEnabled(settings) {
  try {
    if (!soundEnabled(settings)) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

export default {
  playCorrectSoundIfEnabled,
  playCompleteSoundIfEnabled
};
