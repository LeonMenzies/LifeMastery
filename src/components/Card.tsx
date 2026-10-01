import { FC, ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { radius, space, useTheme } from "~theme/Theme";

type CardT = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
};

export const Card: FC<CardT> = ({ children, style, padded = true }) => {
  const colors = useTheme();
  return <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, padded && styles.padded, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  padded: {
    padding: space.lg,
  },
});
