import { FC } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { AppText } from "~components/AppText";
import { IconNameT } from "~components/IconButton";
import { radius, space, useTheme } from "~theme/Theme";

type ButtonT = {
  title: string;
  onPress: () => void;
  variant?: "filled" | "tinted" | "plain" | "destructive";
  icon?: IconNameT;
  disabled?: boolean;
  small?: boolean;
  style?: ViewStyle;
  accessibilityHint?: string;
};

export const Button: FC<ButtonT> = ({ title, onPress, variant = "filled", icon, disabled = false, small = false, style, accessibilityHint }) => {
  const colors = useTheme();
  const palette = {
    filled: { bg: colors.brand, fg: colors.onBrand },
    tinted: { bg: colors.accentSoft, fg: colors.accent },
    plain: { bg: "transparent", fg: colors.accent },
    destructive: { bg: colors.dangerSoft, fg: colors.danger },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityHint={accessibilityHint}
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.button,
        small && styles.small,
        { backgroundColor: disabled && variant !== "plain" ? colors.fill : palette.bg, opacity: pressed ? 0.7 : 1 },
        style,
      ]}
    >
      <View style={styles.content}>
        {icon && <Ionicons name={icon} size={small ? 16 : 18} color={disabled ? colors.textFaint : palette.fg} />}
        <AppText variant={small ? "callout" : "headline"} weight="600" color={disabled ? colors.textFaint : palette.fg}>
          {title}
        </AppText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    paddingHorizontal: space.xl,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  small: {
    minHeight: 36,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
  },
});
