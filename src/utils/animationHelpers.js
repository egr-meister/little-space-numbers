// Simple, safe React Native Animated configs. No heavy libraries, no flashing,
// no stressful motion. These return plain config objects the screens feed into
// Animated.spring / Animated.timing.

export function getCorrectAnswerAnimationConfig() {
  // A gentle little "pop" for a correct answer.
  return {
    toValue: 1,
    friction: 6,
    tension: 60,
    useNativeDriver: true
  };
}

export function getSessionCompleteAnimationConfig() {
  // A calm fade/scale-in for the result screen.
  return {
    toValue: 1,
    duration: 450,
    useNativeDriver: true
  };
}

export default {
  getCorrectAnswerAnimationConfig,
  getSessionCompleteAnimationConfig
};
