import { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { AppText } from "~components/AppText";
import { radius, space, useTheme } from "~theme/Theme";
import { haptic } from "~utils/Haptics";

type StepperT = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  format?: (value: number) => string;
  label: string;
};

export const Stepper: FC<StepperT> = ({ value, onChange, min, max, step = 1, format = String, label }) => {
  const colors = useTheme();

  const change = (next: number) => {
    const clamped = Math.min(max, Math.max(min, next));
    if (clamped !== value) {
      haptic.tap();
      onChange(clamped);
    }
  };

  const button = (icon: "remove" | "add", next: number, disabled: boolean) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${icon === "add" ? "Increase" : "Decrease"} ${label}`}
      accessibilityState={{ disabled }}
      onPress={() => change(next)}
      hitSlop={6}
      style={({ pressed }) => [styles.button, { backgroundColor: colors.surface, opacity: disabled ? 0.35 : pressed ? 0.6 : 1 }]}
    >
      <Ionicons name={icon} size={20} color={colors.accent} />
    </Pressable>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: colors.fill }]}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ text: format(value) }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(e) => change(e.nativeEvent.actionName === "increment" ? value + step : value - step)}
    >
      {button("remove", value - step, value <= min)}
      <AppText variant="headline" style={styles.value}>
        {format(value)}
      </AppText>
      {button("add", value + step, value >= max)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.md,
    padding: 4,
  },
  button: {
    width: 40,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    minWidth: 76,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
});
