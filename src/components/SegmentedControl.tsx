import { StyleSheet, Pressable, View } from "react-native";

import { AppText } from "~components/AppText";
import { radius, space, useTheme } from "~theme/Theme";
import { haptic } from "~utils/Haptics";

type SegmentedControlT<V extends string> = {
  options: { value: V; label: string; sublabel?: string }[];
  value: V;
  onChange: (value: V) => void;
  label?: string;
};

export const SegmentedControl = <V extends string>({ options, value, onChange, label }: SegmentedControlT<V>) => {
  const colors = useTheme();

  return (
    <View accessibilityRole="tablist" accessibilityLabel={label} style={[styles.container, { backgroundColor: colors.fill }]}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => {
              if (!selected) haptic.tap();
              onChange(option.value);
            }}
            style={[styles.segment, selected && [styles.selected, { backgroundColor: colors.surfaceRaised }]]}
          >
            <AppText variant="callout" weight={selected ? "600" : "500"} tone={selected ? "default" : "muted"}>
              {option.label}
            </AppText>
            {option.sublabel ? (
              <AppText variant="caption" tone="faint">
                {option.sublabel}
              </AppText>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: radius.md,
    padding: 3,
  },
  segment: {
    flex: 1,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.sm + 1,
    paddingVertical: space.xs,
  },
  selected: {
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
});
