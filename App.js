import React, { useEffect } from "react";
import { registerRootComponent } from "expo";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { SystemBars } from "react-native-edge-to-edge";

import AppNavigator from "./src/navigation/AppNavigator";
import { colors } from "./src/theme/colors";
import { enableStickyImmersiveMode } from "./src/utils/immersiveHelpers";

// Extend the built-in navigation theme instead of building one from scratch.
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors?.background ?? "#F4F6FF",
    card: colors?.card ?? "#FFFFFF",
    primary: colors?.primary ?? "#6C63FF",
    text: colors?.text ?? "#2E3440",
    border: colors?.border ?? "#E5E8F4",
    notification: colors?.accent ?? "#FFD166"
  }
};

function App() {
  useEffect(() => {
    // Fullscreen sticky immersive on Android. Safe no-op on other platforms.
    enableStickyImmersiveMode();
  }, []);

  return (
    <SafeAreaProvider>
      {/* Hide status + navigation bars; they reappear briefly after an edge swipe. */}
      <SystemBars hidden={true} style="dark" />
      <NavigationContainer theme={navTheme}>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

registerRootComponent(App);

export default App;
