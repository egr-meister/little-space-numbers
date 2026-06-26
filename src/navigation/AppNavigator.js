import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { colors } from "../theme/colors";

import SpaceHomeScreen from "../screens/SpaceHomeScreen";
import NumberLearningScreen from "../screens/NumberLearningScreen";
import GamePickerScreen from "../screens/GamePickerScreen";
import SpaceGameScreen from "../screens/SpaceGameScreen";
import GameResultScreen from "../screens/GameResultScreen";
import StickerProgressScreen from "../screens/StickerProgressScreen";
import ParentSettingsScreen from "../screens/ParentSettingsScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="SpaceHome"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors?.background ?? "#F4F6FF" },
        animation: "fade"
      }}
    >
      <Stack.Screen name="SpaceHome" component={SpaceHomeScreen} />
      <Stack.Screen name="NumberLearning" component={NumberLearningScreen} />
      <Stack.Screen name="GamePicker" component={GamePickerScreen} />
      <Stack.Screen name="SpaceGame" component={SpaceGameScreen} />
      <Stack.Screen name="GameResult" component={GameResultScreen} />
      <Stack.Screen name="StickerProgress" component={StickerProgressScreen} />
      <Stack.Screen name="ParentSettings" component={ParentSettingsScreen} />
    </Stack.Navigator>
  );
}
