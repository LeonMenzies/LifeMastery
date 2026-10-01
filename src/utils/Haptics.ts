import { Platform } from "react-native";
import * as ExpoHaptics from "expo-haptics";

const enabled = Platform.OS === "ios" || Platform.OS === "android";

export const haptic = {
  tap: () => enabled && ExpoHaptics.selectionAsync(),
  light: () => enabled && ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light),
  success: () => enabled && ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Success),
  warning: () => enabled && ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Warning),
  error: () => enabled && ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Error),
};
