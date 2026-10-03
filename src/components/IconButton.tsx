import { ComponentProps, FC } from "react";
import { Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { radius, useTheme } from "~theme/Theme";

export type IconNameT = ComponentProps<typeof Ionicons>["name"];

type IconButtonT = {
  icon: IconNameT;
  label: string;
  onPress: () => void;
  color?: string;
  filled?: boolean;
  disabled?: boolean;
  size?: number;
};

export const IconButton: FC<IconButtonT> = ({ icon, label, onPress, color, filled = false, disabled = false, size = 22 }) => {
  const colors = useTheme();
  const iconColor = disabled ? colors.textFaint : filled ? colors.onBrand : color || colors.accent;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      hitSlop={6}
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [styles.button, { backgroundColor: filled ? colors.brand : colors.fill, opacity: pressed ? 0.6 : 1 }]}
    >
      <Ionicons name={icon} size={size} color={iconColor} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
