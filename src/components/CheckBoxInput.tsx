import { FC, useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useTheme } from "~theme/Theme";

type CheckBoxInputT = {
  checked: boolean;
  color: string;
  onPress: () => void;
  label: string;
  disabled?: boolean;
  size?: number;
};

export const CheckBoxInput: FC<CheckBoxInputT> = ({ checked, color, onPress, label, disabled = false, size = 26 }) => {
  const colors = useTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(withTiming(checked ? 1.18 : 0.88, { duration: 90 }), withSpring(1));
  }, [checked]);

  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable accessibilityRole="checkbox" accessibilityLabel={label} accessibilityState={{ checked, disabled }} hitSlop={10} onPress={disabled ? undefined : onPress}>
      <Animated.View
        style={[
          styles.box,
          { width: size, height: size, borderColor: checked ? color : colors.textFaint, backgroundColor: checked ? color : "transparent" },
          animated,
        ]}
      >
        {checked && <Ionicons name="checkmark" size={size - 8} color="#FFFFFF" />}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  box: {
    borderRadius: 999,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
