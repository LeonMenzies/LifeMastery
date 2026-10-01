import { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { AppText } from "~components/AppText";
import { CheckBoxInput } from "~components/CheckBoxInput";
import { useDataStore } from "~store/dataStore";
import { space, useTheme } from "~theme/Theme";
import { ActionT } from "~types/Types";
import { formatDuration } from "~utils/Helpers";
import { haptic } from "~utils/Haptics";

type HomeActionItemT = {
  action: ActionT;
  color: string;
  priority: number;
  done: boolean;
};

export const HomeActionItem: FC<HomeActionItemT> = ({ action, color, priority, done }) => {
  const colors = useTheme();
  const toggleComplete = useDataStore((s) => s.toggleComplete);

  const toggle = () => {
    done ? haptic.light() : haptic.success();
    toggleComplete(action.id);
  };

  return (
    <Pressable accessible={false} onPress={toggle} style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}>
      <CheckBoxInput checked={done} color={color} onPress={toggle} label={action.title} />
      <View style={styles.text}>
        <AppText variant="body" tone={done ? "faint" : "default"} style={done && styles.done}>
          {action.title}
        </AppText>
        <View style={styles.meta}>
          <AppText variant="footnote" tone="muted">
            {formatDuration(action.minutes)}
          </AppText>
          {action.repeat && <Ionicons name="repeat" size={13} color={colors.textFaint} accessibilityLabel="Repeats" />}
        </View>
      </View>
      {priority > 0 && (
        <View style={[styles.priority, { backgroundColor: colors.fill }]} accessibilityLabel={`Priority ${priority}`}>
          <AppText variant="caption" weight="700" tone="muted">
            {priority}
          </AppText>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingVertical: space.sm + 2,
    minHeight: 52,
  },
  text: {
    flex: 1,
  },
  done: {
    textDecorationLine: "line-through",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    marginTop: 1,
  },
  priority: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
});
