// Fullscreen / keep-awake helpers. Everything here is wrapped so the app never
// crashes if a native API is unavailable on a given platform or in release mode.
//
// Fullscreen sticky immersive (hidden status + navigation bars) is driven by the
// <SystemBars hidden /> component from react-native-edge-to-edge in App.js.
// Keep-awake is only activated on the active game screen and always released.

import { Platform } from "react-native";
import * as KeepAwake from "expo-keep-awake";

const GAME_KEEP_AWAKE_TAG = "little-space-numbers-game";

// Sticky immersive mode is configured declaratively via <SystemBars hidden />.
// This function exists for screens/App that want an imperative hook; it is a
// safe no-op that never throws.
export function enableStickyImmersiveMode() {
  try {
    // No imperative call required: react-native-edge-to-edge handles the
    // edge-to-edge + hidden system bars through the SystemBars component.
    // On Android this yields sticky immersive behavior; bars reappear briefly
    // after an edge swipe, then auto-hide.
    if (Platform.OS === "android") {
      // Intentionally left as a safe hook point.
    }
    return true;
  } catch (e) {
    return false;
  }
}

export async function activateGameKeepAwake() {
  try {
    if (typeof KeepAwake.activateKeepAwakeAsync === "function") {
      await KeepAwake.activateKeepAwakeAsync(GAME_KEEP_AWAKE_TAG);
    } else if (typeof KeepAwake.activateKeepAwake === "function") {
      KeepAwake.activateKeepAwake(GAME_KEEP_AWAKE_TAG);
    }
    return true;
  } catch (e) {
    return false;
  }
}

export function deactivateGameKeepAwake() {
  try {
    if (typeof KeepAwake.deactivateKeepAwake === "function") {
      KeepAwake.deactivateKeepAwake(GAME_KEEP_AWAKE_TAG);
    }
    return true;
  } catch (e) {
    return false;
  }
}

// Generic safe release used when leaving any game screen.
export function disableKeepAwakeSafely() {
  return deactivateGameKeepAwake();
}

export default {
  enableStickyImmersiveMode,
  activateGameKeepAwake,
  deactivateGameKeepAwake,
  disableKeepAwakeSafely
};
