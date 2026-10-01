import { FC, useMemo, useState } from "react";
import { Pressable, SectionList, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { AppText } from "~components/AppText";
import { Button } from "~components/Button";
import { Card } from "~components/Card";
import { Sheet } from "~components/Sheet";
import { TextField } from "~components/TextField";
import { PlanActionsListItem } from "~pages/Plan/PlanActionsListItem";
import { useAlertStore } from "~store/alertStore";
import { useDataStore } from "~store/dataStore";
import { useSettingsStore } from "~store/settingsStore";
import { useUiStore } from "~store/uiStore";
import { radius, space, useAreaColor, useTheme } from "~theme/Theme";
import { ActionT, PlanDayT } from "~types/Types";
import { MAX_PRIORITY } from "~utils/Constants";
import { formatDuration, isDueOn } from "~utils/Helpers";
import { haptic } from "~utils/Haptics";
import { planMinutes } from "~utils/PlanLogic";

type PlanCardT = { day: PlanDayT };

type SectionT = { key: string; title: string; color: string; data: ActionT[] };

export const PlanCard: FC<PlanCardT> = ({ day }) => {
  const colors = useTheme();
  const areaColor = useAreaColor();
  const setAlert = useAlertStore((s) => s.setAlert);
  const plan = useDataStore((s) => s[day]);
  const otherPlan = useDataStore((s) => s[day === "today" ? "tomorrow" : "today"]);
  const areas = useDataStore((s) => s.areas);
  const actions = useDataStore((s) => s.actions);
  const setPriority = useDataStore((s) => s.setPriority);
  const removeFromPlan = useDataStore((s) => s.removeFromPlan);
  const setFocus = useDataStore((s) => s.setFocus);
  const finalizeToday = useDataStore((s) => s.finalizeToday);
  const editToday = useDataStore((s) => s.editToday);
  const maxHours = useSettingsStore((s) => s.settings.maxPlanHours);
  const setTab = useUiStore((s) => s.setTab);
  const openActionSheet = useUiStore((s) => s.openActionSheet);
  const [selected, setSelected] = useState<ActionT | null>(null);

  const locked = plan.finalized;
  const total = planMinutes(plan, actions);
  const max = maxHours * 60;
  const over = total > max;

  const sections = useMemo<SectionT[]>(() => {
    const available = actions
      .filter((a) => !a.completedOn || plan.actionIds.includes(a.id))
      .sort((a, b) => Number(isDueOn(b, plan.date)) - Number(isDueOn(a, plan.date)) || b.createdAt.localeCompare(a.createdAt));
    const result: SectionT[] = areas.map((area) => ({ key: area.id, title: area.name, color: areaColor(area.color), data: available.filter((a) => a.areaId === area.id) }));
    result.push({ key: "none", title: "No area", color: areaColor(undefined), data: available.filter((a) => !areas.some((area) => area.id === a.areaId)) });
    return result.filter((s) => s.data.length > 0);
  }, [actions, areas, plan.actionIds, plan.date, colors.dark]);

  const handlePress = (item: ActionT) => {
    if (locked) {
      setAlert({ message: "This plan is finalized. Tap Edit plan to change it.", type: "info" });
      return;
    }
    haptic.tap();
    setSelected(item);
  };

  const handleFinalize = () => {
    const result = finalizeToday(max);
    if (result.ok === false) {
      haptic.error();
      setAlert({ message: result.message, type: "error" });
      return;
    }
    haptic.success();
    setTab("home");
  };

  const header = (
    <View style={styles.headerArea}>
      <TextField
        label={day === "today" ? "Key focus for today" : "Key focus for tomorrow"}
        value={plan.focus}
        onChangeText={(text) => setFocus(day, text)}
        placeholder="Optional: the one thing that matters most"
        maxLength={60}
        returnKeyType="done"
      />
      <Card style={styles.budget}>
        <View style={styles.budgetRow}>
          <AppText variant="headline" style={styles.flex}>
            {formatDuration(total)}{" "}
            <AppText variant="callout" tone="muted">
              of {maxHours}h planned
            </AppText>
          </AppText>
          <AppText variant="footnote" tone="muted">
            {plan.actionIds.length} action{plan.actionIds.length === 1 ? "" : "s"}
          </AppText>
        </View>
        <View style={[styles.track, { backgroundColor: colors.fill }]} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max, now: Math.min(total, max) }}>
          <View style={[styles.trackFill, { width: `${Math.min(100, (total / max) * 100)}%`, backgroundColor: over ? colors.danger : colors.accent }]} />
        </View>
        {over && (
          <View style={styles.overRow}>
            <Ionicons name="warning" size={16} color={colors.danger} />
            <AppText variant="footnote" tone="danger" style={styles.flex}>
              Over by {formatDuration(total - max)}.{" "}
              {day === "today" ? "Finalizing now will clear the plan, so take something out first." : "Trim it before you finalize tomorrow."}
            </AppText>
          </View>
        )}
      </Card>
      <AppText variant="footnote" tone="muted" style={styles.hint}>
        {locked ? "Finalized. Tap Edit plan below to make changes." : "Tap an action to add it and set its priority (1 = first). Your picks save automatically."}
      </AppText>
    </View>
  );

  return (
    <View style={styles.flex}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.list}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <Card style={styles.empty}>
            <AppText variant="headline">No actions to plan</AppText>
            <AppText variant="callout" tone="muted" style={styles.center}>
              Add the things you want to get done, then pick them here.
            </AppText>
            <Button title="New action" icon="add" onPress={() => openActionSheet()} />
          </Card>
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <View style={[styles.dot, { backgroundColor: section.color }]} />
            <AppText variant="footnote" weight="700" tone="muted" style={styles.sectionTitle}>
              {section.title.toUpperCase()}
            </AppText>
          </View>
        )}
        renderItem={({ item, section }) => {
          const inOther = otherPlan.actionIds.includes(item.id) && !item.repeat;
          return (
            <PlanActionsListItem
              item={item}
              color={section.color}
              priority={plan.actionIds.includes(item.id) ? plan.priorities[item.id] || 1 : null}
              due={isDueOn(item, plan.date)}
              note={inOther ? (day === "today" ? "In tomorrow's plan" : "In today's plan") : undefined}
              locked={locked}
              onPress={() => handlePress(item)}
            />
          );
        }}
      />

      <View style={[styles.bottom, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
        {day === "today" ? (
          locked ? (
            <View style={styles.bottomRow}>
              <View style={[styles.badge, { backgroundColor: colors.successSoft }]}>
                <Ionicons name="lock-closed" size={14} color={colors.success} />
                <AppText variant="callout" weight="600" tone="success">
                  Plan finalized
                </AppText>
              </View>
              <Button title="Edit plan" variant="tinted" onPress={editToday} style={styles.flex} />
            </View>
          ) : (
            <Button title="Finalize plan" icon="checkmark" onPress={handleFinalize} disabled={plan.actionIds.length === 0} accessibilityHint="Locks today's plan and starts tracking" />
          )
        ) : (
          <View style={styles.tomorrowNote}>
            <Ionicons name="cloud-done-outline" size={18} color={colors.textMuted} />
            <AppText variant="footnote" tone="muted" style={styles.flex}>
              Saved automatically. At midnight this becomes today's plan, ready to finalize.
            </AppText>
          </View>
        )}
      </View>

      <PrioritySheet
        action={selected}
        current={selected && plan.actionIds.includes(selected.id) ? plan.priorities[selected.id] || 1 : null}
        onClose={() => setSelected(null)}
        onPick={(p) => {
          setPriority(day, selected.id, p);
          haptic.light();
          setSelected(null);
        }}
        onRemove={() => {
          removeFromPlan(day, selected.id);
          haptic.light();
          setSelected(null);
        }}
      />
    </View>
  );
};

type PrioritySheetT = {
  action: ActionT | null;
  current: number | null;
  onClose: () => void;
  onPick: (priority: number) => void;
  onRemove: () => void;
};

const PrioritySheet: FC<PrioritySheetT> = ({ action, current, onClose, onPick, onRemove }) => {
  const colors = useTheme();

  return (
    <Sheet variant="compact" visible={!!action} onClose={onClose} title={action?.title || ""}>
      <AppText variant="callout" tone="muted" style={styles.center}>
        {current ? "Change its priority, or take it out of the plan." : "Pick a priority to add it to the plan. 1 is done first."}
      </AppText>
      <View style={styles.priorities}>
        {Array.from({ length: MAX_PRIORITY }, (_, i) => i + 1).map((p) => {
          const on = p === current;
          return (
            <Pressable
              key={p}
              accessibilityRole="button"
              accessibilityLabel={`Priority ${p}`}
              accessibilityState={{ selected: on }}
              onPress={() => onPick(p)}
              style={({ pressed }) => [styles.priority, { backgroundColor: on ? colors.accent : colors.fill, opacity: pressed ? 0.6 : 1 }]}
            >
              <AppText variant="title" color={on ? colors.onAccent : colors.text}>
                {p}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      {current ? <Button title="Remove from plan" variant="destructive" icon="remove-circle-outline" onPress={onRemove} /> : null}
    </Sheet>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    textAlign: "center",
  },
  list: {
    paddingHorizontal: space.lg,
    paddingBottom: space.xl,
  },
  headerArea: {
    gap: space.md,
    marginBottom: space.sm,
  },
  budget: {
    gap: space.sm,
  },
  budgetRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  trackFill: {
    height: 8,
    borderRadius: 4,
  },
  overRow: {
    flexDirection: "row",
    gap: space.sm,
    alignItems: "flex-start",
  },
  hint: {
    paddingHorizontal: space.xs,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingTop: space.lg,
    paddingBottom: space.sm,
  },
  sectionTitle: {
    letterSpacing: 0.6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  empty: {
    alignItems: "center",
    gap: space.md,
    marginTop: space.lg,
  },
  bottom: {
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: space.md,
    height: 50,
    borderRadius: radius.md,
  },
  tomorrowNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    minHeight: 50,
  },
  priorities: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: space.md,
    marginVertical: space.xl,
  },
  priority: {
    width: 60,
    height: 60,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
});
