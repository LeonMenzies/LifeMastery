import { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { AppText } from "~components/AppText";
import { Card } from "~components/Card";
import { HomeActionItem } from "~pages/Home/HomeActionItem";
import { space, useTheme } from "~theme/Theme";
import { ActionT, PlanT } from "~types/Types";
import { formatDuration } from "~utils/Helpers";

type HomeActionSectionT = {
  name: string;
  color: string;
  actions: ActionT[];
  plan: PlanT;
  onDrag?: () => void;
  dragging?: boolean;
};

export const HomeActionSection: FC<HomeActionSectionT> = ({ name, color, actions, plan, onDrag, dragging }) => {
  const colors = useTheme();
  const total = actions.reduce((sum, a) => sum + a.minutes, 0);
  const doneCount = actions.filter((a) => plan.completedIds.includes(a.id)).length;
  const sorted = [...actions].sort((a, b) => (plan.priorities[a.id] || 99) - (plan.priorities[b.id] || 99));

  return (
    <Card style={[styles.card, dragging && { borderColor: color, transform: [{ scale: 1.02 }] }]}>
      <Pressable
        onLongPress={onDrag}
        delayLongPress={250}
        disabled={!onDrag}
        accessibilityHint={onDrag ? "Long press and drag to reorder areas" : undefined}
        style={styles.header}
      >
        <View style={[styles.bar, { backgroundColor: color }]} />
        <AppText variant="headline" style={styles.title} numberOfLines={1} accessibilityRole="header">
          {name}
        </AppText>
        <AppText variant="footnote" tone="muted">
          {doneCount}/{actions.length} · {formatDuration(total)}
        </AppText>
        {onDrag && <Ionicons name="reorder-two" size={20} color={colors.textFaint} />}
      </Pressable>
      {sorted.map((action, index) => (
        <View key={action.id}>
          {index > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
          <HomeActionItem action={action} color={color} priority={plan.priorities[action.id] || 0} done={plan.completedIds.includes(action.id)} />
        </View>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingTop: space.md,
    paddingBottom: space.xs,
    marginBottom: space.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingBottom: space.xs,
  },
  bar: {
    width: 4,
    height: 18,
    borderRadius: 2,
  },
  title: {
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 38,
  },
});
