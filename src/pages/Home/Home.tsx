import { FC, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import Ionicons from "@expo/vector-icons/Ionicons";

import { AppText } from "~components/AppText";
import { Button } from "~components/Button";
import { Card } from "~components/Card";
import { Chip } from "~components/Chip";
import { IconButton } from "~components/IconButton";
import { ProgressRing } from "~components/ProgressRing";
import { Screen, ScreenHeader } from "~components/Screen";
import { HomeActionSection } from "~pages/Home/HomeActionSection";
import { Balance } from "~pages/Home/Balance";
import { useAlertStore } from "~store/alertStore";
import { useDataStore } from "~store/dataStore";
import { useSettingsStore } from "~store/settingsStore";
import { useUiStore } from "~store/uiStore";
import { radius, space, useAreaColor, useTheme } from "~theme/Theme";
import { ActionT } from "~types/Types";
import { STARTER_AREAS } from "~utils/Constants";
import { formatDayMonth, formatWeekday } from "~utils/Dates";
import { formatDuration, reorderSubset } from "~utils/Helpers";
import { haptic } from "~utils/Haptics";
import { planActions, planMinutes, planProgress } from "~utils/PlanLogic";

type SectionT = { key: string; name: string; color: string; actions: ActionT[]; draggable: boolean };

export const Home: FC = () => {
  const colors = useTheme();
  const areaColor = useAreaColor();
  const areas = useDataStore((s) => s.areas);
  const actions = useDataStore((s) => s.actions);
  const plan = useDataStore((s) => s.today);
  const reorderAreas = useDataStore((s) => s.reorderAreas);
  const progressBy = useSettingsStore((s) => s.settings.progressBy);
  const [balanceOpen, setBalanceOpen] = useState(false);

  const progress = planProgress(plan, actions, progressBy);
  const complete = plan.finalized && progress.totalCount > 0 && progress.doneCount === progress.totalCount;

  const sections = useMemo<SectionT[]>(() => {
    const items = planActions(plan, actions);
    const result: SectionT[] = areas
      .map((area) => ({ key: area.id, name: area.name, color: areaColor(area.color), actions: items.filter((a) => a.areaId === area.id), draggable: true }))
      .filter((s) => s.actions.length > 0);
    const orphans = items.filter((a) => !areas.some((area) => area.id === a.areaId));
    if (orphans.length > 0) result.push({ key: "none", name: "No area", color: areaColor(undefined), actions: orphans, draggable: false });
    return result;
  }, [areas, actions, plan, colors.dark]);

  const header = (
    <View>
      <ScreenHeader
        subtitle={formatDayMonth(plan.date)}
        title={formatWeekday(plan.date)}
        right={<IconButton icon="stats-chart" label="Balance and history" onPress={() => setBalanceOpen(true)} />}
      />
      <View style={styles.content}>
        {plan.finalized ? (
          <ProgressCard percent={progress.percent} progress={progress} progressBy={progressBy} focus={plan.focus} complete={complete} />
        ) : (
          <NotFinalized />
        )}
        <CarryOver />
      </View>
    </View>
  );

  return (
    <Screen>
      <DraggableFlatList
        data={plan.finalized ? sections : []}
        keyExtractor={(s) => s.key}
        ListHeaderComponent={header}
        contentContainerStyle={styles.list}
        activationDistance={12}
        onDragBegin={() => haptic.light()}
        onDragEnd={({ data }) => {
          haptic.tap();
          reorderAreas(
            reorderSubset(
              areas.map((a) => a.id),
              data.filter((s) => s.draggable).map((s) => s.key),
            ),
          );
        }}
        renderItem={({ item, drag, isActive }) => (
          <View style={styles.content}>
            <HomeActionSection name={item.name} color={item.color} actions={item.actions} plan={plan} onDrag={item.draggable ? drag : undefined} dragging={isActive} />
          </View>
        )}
      />
      <Balance visible={balanceOpen} onClose={() => setBalanceOpen(false)} />
    </Screen>
  );
};

// Hero card in the brand blue with a yellow ring, like the app icon
const ProgressCard: FC<{ percent: number; progress: ReturnType<typeof planProgress>; progressBy: string; focus: string; complete: boolean }> = ({ percent, progress, progressBy, focus, complete }) => {
  const colors = useTheme();
  const soft = "rgba(255, 255, 255, 0.75)";

  return (
    <Card style={[styles.progressCard, { backgroundColor: colors.hero, borderColor: colors.hero }]}>
      <View style={styles.progressRow}>
        <ProgressRing percent={percent} color={colors.brand} trackColor="rgba(255, 255, 255, 0.18)">
          {complete ? (
            <Ionicons name="trophy" size={34} color={colors.brand} accessibilityLabel="Day complete" />
          ) : (
            <AppText variant="title" color={colors.onHero} style={styles.tabular}>
              {Math.round(percent)}%
            </AppText>
          )}
        </ProgressRing>
        <View style={styles.flex}>
          <AppText variant="headline" color={colors.onHero}>
            {complete ? "Day complete" : percent > 0 ? "Keep going" : "Let's get started"}
          </AppText>
          <AppText variant="callout" color={soft} style={styles.progressLine}>
            {progress.doneCount} of {progress.totalCount} actions done
          </AppText>
          <AppText variant="callout" color={soft}>
            {formatDuration(progress.doneMinutes)} of {formatDuration(progress.totalMinutes)}
          </AppText>
          <AppText variant="caption" color="rgba(255, 255, 255, 0.6)" style={styles.progressLine}>
            Progress counts by {progressBy === "time" ? "time" : "tasks"}
          </AppText>
        </View>
      </View>
      {focus ? (
        <View style={[styles.focus, { backgroundColor: "rgba(255, 255, 255, 0.14)" }]}>
          <Ionicons name="flag" size={16} color={colors.brand} />
          <AppText variant="callout" weight="600" color={colors.onHero} style={styles.flex}>
            {focus}
          </AppText>
        </View>
      ) : null}
    </Card>
  );
};

const NotFinalized: FC = () => {
  const colors = useTheme();
  const areas = useDataStore((s) => s.areas);
  const actions = useDataStore((s) => s.actions);
  const plan = useDataStore((s) => s.today);
  const openPlan = useUiStore((s) => s.openPlan);
  const openActionSheet = useUiStore((s) => s.openActionSheet);

  if (areas.length === 0) return <Welcome />;

  if (actions.length === 0) {
    return (
      <Card style={styles.emptyCard}>
        <Ionicons name="sparkles" size={28} color={colors.accent} />
        <AppText variant="title">Add your first action</AppText>
        <AppText variant="callout" tone="muted" style={styles.center}>
          Actions are the things you want to get done, each with a time estimate and an area.
        </AppText>
        <Button title="New action" icon="add" onPress={() => openActionSheet()} style={styles.wide} />
      </Card>
    );
  }

  const picked = plan.actionIds.length;
  return (
    <Card style={styles.emptyCard}>
      <Ionicons name="calendar" size={28} color={colors.accent} />
      <AppText variant="title">{picked > 0 ? "Almost there" : "No plan for today yet"}</AppText>
      <AppText variant="callout" tone="muted" style={styles.center}>
        {picked > 0
          ? `You've picked ${picked} action${picked === 1 ? "" : "s"} (${formatDuration(planMinutes(plan, actions))}). Finalize the plan to start your day.`
          : "Pick the actions you'll do today, then finalize the plan to start tracking."}
      </AppText>
      <Button title={picked > 0 ? "Review and finalize" : "Plan today"} icon="arrow-forward" onPress={() => openPlan("today")} style={styles.wide} />
    </Card>
  );
};

const Welcome: FC = () => {
  const colors = useTheme();
  const addArea = useDataStore((s) => s.addArea);
  const setAreasSheet = useUiStore((s) => s.setAreasSheet);
  const setAlert = useAlertStore((s) => s.setAlert);
  const [picked, setPicked] = useState<string[]>(["Health", "Work", "Relationships"]);

  const create = () => {
    picked.forEach((name) => addArea(name));
    haptic.success();
    setAlert({ message: "Areas created. Now add some actions.", type: "success" });
  };

  return (
    <Card style={styles.welcome}>
      <AppText variant="title">Welcome to LifeMastery</AppText>
      <AppText variant="callout" tone="muted">
        Plan each day around the parts of your life that matter.
      </AppText>
      <View style={styles.steps}>
        {["Choose your areas of importance", "Add actions with a time estimate", "Plan your day and finalize it"].map((step, i) => (
          <View key={step} style={styles.step}>
            <View style={[styles.stepNumber, { backgroundColor: i === 0 ? colors.brand : colors.fill }]}>
              <AppText variant="caption" weight="700" color={i === 0 ? colors.onBrand : colors.textMuted}>
                {i + 1}
              </AppText>
            </View>
            <AppText variant="body" tone={i === 0 ? "default" : "muted"}>
              {step}
            </AppText>
          </View>
        ))}
      </View>
      <AppText variant="footnote" weight="600" tone="muted">
        PICK A FEW TO START
      </AppText>
      <View style={styles.wrap}>
        {STARTER_AREAS.map((name) => (
          <Chip
            key={name}
            label={name}
            selected={picked.includes(name)}
            icon={picked.includes(name) ? "checkmark" : "add"}
            onPress={() => {
              haptic.tap();
              setPicked((p) => (p.includes(name) ? p.filter((n) => n !== name) : [...p, name]));
            }}
          />
        ))}
      </View>
      <Button title={`Create ${picked.length} area${picked.length === 1 ? "" : "s"}`} onPress={create} disabled={picked.length === 0} />
      <Button title="Make my own" variant="plain" onPress={() => setAreasSheet(true)} />
    </Card>
  );
};

const CarryOver: FC = () => {
  const colors = useTheme();
  const carryOver = useDataStore((s) => s.carryOver);
  const actions = useDataStore((s) => s.actions);
  const accept = useDataStore((s) => s.acceptCarryOver);
  const dismiss = useDataStore((s) => s.dismissCarryOver);
  const openPlan = useUiStore((s) => s.openPlan);

  const items = carryOver.map((id) => actions.find((a) => a.id === id && !a.completedOn)).filter(Boolean);
  if (items.length === 0) return null;

  return (
    <Card style={[styles.carry, { borderColor: colors.warning, backgroundColor: colors.warningSoft }]}>
      <View style={styles.carryTitle}>
        <Ionicons name="time-outline" size={20} color={colors.warning} />
        <AppText variant="headline" style={styles.flex}>
          {items.length} unfinished from your last plan
        </AppText>
      </View>
      <AppText variant="callout" tone="muted" numberOfLines={2}>
        {items.map((a) => a.title).join(", ")}
      </AppText>
      <View style={styles.carryButtons}>
        <Button title="Not now" variant="plain" small onPress={dismiss} />
        <Button
          title="Add to today"
          small
          onPress={() => {
            haptic.success();
            accept();
            openPlan("today");
          }}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  list: {
    paddingBottom: space.xxxl,
  },
  content: {
    paddingHorizontal: space.lg,
  },
  tabular: {
    fontVariant: ["tabular-nums"],
  },
  progressCard: {
    marginBottom: space.lg,
    gap: space.lg,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xl,
  },
  progressLine: {
    marginTop: space.xs,
  },
  focus: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
  },
  emptyCard: {
    alignItems: "center",
    gap: space.md,
    paddingVertical: space.xxl,
    marginBottom: space.lg,
  },
  center: {
    textAlign: "center",
  },
  wide: {
    alignSelf: "stretch",
    marginTop: space.sm,
  },
  welcome: {
    gap: space.md,
    marginBottom: space.lg,
  },
  steps: {
    gap: space.sm,
    marginVertical: space.sm,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  carry: {
    gap: space.sm,
    marginBottom: space.lg,
    borderWidth: 1,
  },
  carryTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
  },
  carryButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: space.sm,
  },
});
