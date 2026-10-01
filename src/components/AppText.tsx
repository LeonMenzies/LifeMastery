import { FC } from "react";
import { Text, TextProps } from "react-native";

import { type, useTheme } from "~theme/Theme";

type AppTextT = TextProps & {
  variant?: keyof typeof type;
  tone?: "default" | "muted" | "faint" | "accent" | "danger" | "success" | "warning" | "onAccent";
  color?: string;
  weight?: "400" | "500" | "600" | "700";
};

export const AppText: FC<AppTextT> = ({ variant = "body", tone = "default", color, weight, style, ...props }) => {
  const colors = useTheme();
  const toneColor = {
    default: colors.text,
    muted: colors.textMuted,
    faint: colors.textFaint,
    accent: colors.accent,
    danger: colors.danger,
    success: colors.success,
    warning: colors.warning,
    onAccent: colors.onAccent,
  }[tone];

  return <Text {...props} style={[type[variant], { color: color || toneColor }, weight && { fontWeight: weight }, style]} />;
};
