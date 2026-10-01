import { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { AppText } from "~components/AppText";
import { radius, space, tint, useTheme } from "~theme/Theme";
import { ActionT } from "~types/Types";
import { formatDuration } from "~utils/Helpers";

type PlanActionsListItemT = {
  item: ActionT;
  color: string;
  priority: number | null;
  due: boolean;
  note?: string;
  locked: boolean;
  onPress: () => void;
};

export const PlanActionsListItem: FC<PlanActionsListItemT> = ({ item, color, priority, due, note, locked, onPress }) => {
  const colors = useTheme();
  const inPlan = priority !== null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${formatDuration(item.minutes)}${inPlan ? `, in plan with priority ${priority}` : ""}`}
      accessibilityHint={locked ? undefined : inPlan ? "Change priority or remove" : "Add to plan"}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: inPlan ? tint(color, colors.dark ? 0.16 : 0.08) : colors.surface, borderColor: inPlan ? tint(color, 0.5) : colors.border, opacity: pressed ? 0.7 : locked && !inPlan ? 0.5 : 1 },
      ]}
    >
      <View style={[styles.marker, inPlan ? { backgroundColor: color, borderColor: color } : { borderColor: colors.textFaint }]}>
        {inPlan ? (
          <AppText variant="callout" weight="700" color="#FFFFFF">
            {priority}
          </AppText>
        ) : (
          !locked && <Ionicons name="add" size={18} color={colors.textFaint} />
        )}
      </View>
      <View style={styles.text}>
        <AppText variant="body" weight={inPlan ? "600" : "400"} numberOfLines={2}>
          {item.title}
        </AppText>
        <View style={styles.meta}>
          <AppText variant="footnote" tone="muted">
            {formatDuration(item.minutes)}
          </AppText>
          {item.repeat && (
            <View style={styles.inline}>
              <Ionicons name="repeat" size={13} color={due ? colors.accent : colors.textFaint} />
              {due && (
                <AppText variant="footnote" weight="600" tone="accent">
                  Due
                </AppText>
              )}
            </View>
          )}
          {note ? (
            <AppText variant="footnote" tone="faint" numberOfLines={1}>
              · {note}
            </AppText>
          ) : null}
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
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: space.sm,
    minHeight: 56,
  },
  marker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    marginTop: 2,
  },
  inline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
});
