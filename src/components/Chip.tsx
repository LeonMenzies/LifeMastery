import { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { AppText } from "~components/AppText";
import { IconNameT } from "~components/IconButton";
import { radius, space, tint, useTheme } from "~theme/Theme";

type ChipT = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  color?: string;
  icon?: IconNameT;
  onLongPress?: () => void;
};

export const Chip: FC<ChipT> = ({ label, selected = false, onPress, color, icon, onLongPress }) => {
  const colors = useTheme();
  const base = color || colors.accent;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? tint(base, colors.dark ? 0.28 : 0.14) : colors.fill,
          borderColor: selected ? base : "transparent",
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      {color && !icon && <View style={[styles.dot, { backgroundColor: color }]} />}
      {icon && <Ionicons name={icon} size={15} color={selected ? base : colors.textMuted} />}
      <AppText variant="callout" weight={selected ? "600" : "500"} color={selected ? colors.text : colors.textMuted}>
        {label}
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 36,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
