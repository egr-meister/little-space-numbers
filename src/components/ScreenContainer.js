import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, spacing } from "../theme/colors";

// Wraps screen content with safe-area padding so nothing overlaps notches,
// camera cutouts, or rounded corners. Optionally scrollable.
export default function ScreenContainer({ children, scroll = true, contentStyle }) {
  const insets = useSafeAreaInsets();
  const bg = colors?.background ?? "#F4F6FF";

  const padding = {
    paddingTop: (insets?.top ?? 0) + spacing.md,
    paddingBottom: (insets?.bottom ?? 0) + spacing.lg,
    paddingLeft: (insets?.left ?? 0) + spacing.lg,
    paddingRight: (insets?.right ?? 0) + spacing.lg
  };

  if (scroll) {
    return (
      <ScrollView
        style={[styles.flex, { backgroundColor: bg }]}
        contentContainerStyle={[styles.scrollContent, padding, contentStyle]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.flex, { backgroundColor: bg }, padding, contentStyle]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1
  }
});
