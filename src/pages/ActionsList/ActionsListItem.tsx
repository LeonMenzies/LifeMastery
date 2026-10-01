import { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { AppText } from "~components/AppText";
import { CheckBoxInput } from "~components/CheckBoxInput";
import { radius, space, useTheme } from "~theme/Theme";
import { ActionT } from "~types/Types";
import { formatShortDate } from "~utils/Dates";
import { describeRepeat, formatDuration } from "~utils/Helpers";

type ActionsListItemT = {
  item: ActionT;
  areaName: string;
  areaColor: string;
  inTodayPlan: boolean;
  selecting: boolean;
  selected: boolean;
  onPress: () => void;
  onLongPress: () => void;
};

export const ActionsListItem: FC<ActionsListItemT> = ({ item, areaName, areaColor, inTodayPlan, selecting, selected, onPress, onLongPress }) => {
  const colors = useTheme();
  const completed = !!item.completedOn;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={selecting ? "Toggles selection" : "Opens the action to edit"}
      accessibilityState={{ selected }}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={350}
      style={({ pressed }) => [styles.row, { backgroundColor: selected ? colors.dangerSoft : colors.surface, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
    >
      {selecting && <CheckBoxInput checked={selected} color={colors.danger} onPress={onPress} label={`Select ${item.title}`} size={24} />}
      <View style={styles.text}>
        <View style={styles.titleRow}>
          {completed && <Ionicons name="checkmark-circle" size={16} color={colors.success} accessibilityLabel="Completed" />}
          <AppText variant="body" weight="500" tone={completed ? "muted" : "default"} style={styles.flex} numberOfLines={2}>
            {item.title}
          </AppText>
          <AppText variant="callout" tone="muted" style={styles.tabular}>
            {formatDuration(item.minutes)}
          </AppText>
        </View>
        <View style={styles.meta}>
          <View style={[styles.dot, { backgroundColor: areaColor }]} />
          <AppText variant="footnote" tone="muted" numberOfLines={1}>
            {areaName}
          </AppText>
          {item.repeat && (
            <View style={styles.inline}>
              <Ionicons name="repeat" size={13} color={colors.textMuted} />
              <AppText variant="footnote" tone="muted">
                {describeRepeat(item)}
              </AppText>
            </View>
          )}
          {inTodayPlan && (
            <View style={[styles.pill, { backgroundColor: colors.accentSoft }]}>
              <AppText variant="caption" tone="accent">
                Today
              </AppText>
            </View>
          )}
          <AppText variant="footnote" tone="faint" style={styles.date}>
            {completed ? `Done ${formatShortDate(item.completedOn)}` : formatShortDate(item.createdAt)}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: space.sm,
  },
  flex: {
    flex: 1,
  },
  text: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
  },
  tabular: {
    fontVariant: ["tabular-nums"],
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  inline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  pill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
  },
  date: {
    marginLeft: "auto",
  },
});
