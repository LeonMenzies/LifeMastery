import { FC, ReactNode } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Switch, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";

import { AppText } from "~components/AppText";
import { IconNameT } from "~components/IconButton";
import { Screen, ScreenHeader } from "~components/Screen";
import { SegmentedControl } from "~components/SegmentedControl";
import { Stepper } from "~components/Stepper";
import { useAlertStore } from "~store/alertStore";
import { pickData, useDataStore } from "~store/dataStore";
import { useSettingsStore } from "~store/settingsStore";
import { useUiStore } from "~store/uiStore";
import { radius, space, useTheme } from "~theme/Theme";
import { PlanDayT, ReminderT, SettingsT } from "~types/Types";
import { exportBackup, pickBackup } from "~utils/Backup";
import { haptic } from "~utils/Haptics";
import { requestReminderPermission } from "~utils/Notifications";

const formatHour = (h: number) => new Date(2000, 0, 1, h).toLocaleTimeString(undefined, { hour: "numeric" });

export const Settings: FC = () => {
  const colors = useTheme();
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const replaceSettings = useSettingsStore((s) => s.replaceSettings);
  const setAlert = useAlertStore((s) => s.setAlert);
  const actionCount = useDataStore((s) => s.actions.length);
  const areaCount = useDataStore((s) => s.areas.length);
  const clearActions = useDataStore((s) => s.clearActions);
  const clearPlan = useDataStore((s) => s.clearPlan);
  const replaceData = useDataStore((s) => s.replaceData);
  const setAreasSheet = useUiStore((s) => s.setAreasSheet);
  const mobile = Platform.OS === "ios" || Platform.OS === "android";

  const setReminder = async (key: "eveningReminder" | "morningReminder", patch: Partial<ReminderT>) => {
    if (patch.enabled && !(await requestReminderPermission())) {
      setAlert({ message: "Notifications are turned off for LifeMastery. Allow them in the Settings app.", type: "warning" });
      return;
    }
    updateSettings({ [key]: { ...settings[key], ...patch } } as Partial<SettingsT>);
  };

  const confirm = (title: string, message: string, label: string, onConfirm: () => void) =>
    Alert.alert(title, message, [
      { text: "Cancel", style: "cancel" },
      {
        text: label,
        style: "destructive",
        onPress: () => {
          haptic.warning();
          onConfirm();
        },
      },
    ]);

  const handleExport = async () => {
    try {
      await exportBackup(pickData(useDataStore.getState()), settings);
    } catch (e) {
      setAlert({ message: "Couldn't create the backup file", type: "error" });
    }
  };

  const handleImport = async () => {
    try {
      const backup = await pickBackup();
      if (!backup) return;
      confirm(
        "Replace all data?",
        `This backup from ${new Date(backup.exportedAt).toLocaleDateString()} has ${backup.data.actions.length} actions and ${backup.data.areas.length} areas. Everything currently in the app will be replaced.`,
        "Replace",
        () => {
          replaceData(backup.data);
          replaceSettings(backup.settings);
          setAlert({ message: "Backup restored", type: "success" });
        },
      );
    } catch (e) {
      setAlert({ message: e instanceof Error ? e.message : "Couldn't read that file", type: "error" });
    }
  };

  const clearDay = (day: PlanDayT) =>
    confirm(`Clear ${day === "today" ? "today's" : "tomorrow's"} plan?`, "Your actions stay in the list. Only the plan's picks, priorities and focus are removed.", "Clear plan", () => clearPlan(day));

  return (
    <Screen>
      <ScreenHeader title="Settings" />
      <ScrollView contentContainerStyle={styles.content}>
        <Group title="Appearance">
          <Row icon="contrast-outline" title="Theme" stacked>
            <View style={styles.segment}>
              <SegmentedControl<SettingsT["appearance"]>
                label="Theme"
                value={settings.appearance}
                onChange={(appearance) => updateSettings({ appearance })}
                options={[
                  { value: "system", label: "Auto" },
                  { value: "light", label: "Light" },
                  { value: "dark", label: "Dark" },
                ]}
              />
            </View>
          </Row>
        </Group>

        <Group title="Planning">
          <Row icon="pie-chart-outline" title="Progress counts by" detail="How Today's percentage is worked out" stacked>
            <View style={styles.segment}>
              <SegmentedControl<SettingsT["progressBy"]>
                label="Progress counts by"
                value={settings.progressBy}
                onChange={(progressBy) => updateSettings({ progressBy })}
                options={[
                  { value: "time", label: "Time" },
                  { value: "tasks", label: "Tasks" },
                ]}
              />
            </View>
          </Row>
          <Row icon="hourglass-outline" title="Max plan time" detail="Plans longer than this can't be finalized" stacked>
            <Stepper label="Max plan time" value={settings.maxPlanHours} onChange={(maxPlanHours) => updateSettings({ maxPlanHours })} min={1} max={24} format={(h) => `${h}h`} />
          </Row>
          <Row icon="bulb-outline" title="Suggest past actions" detail="While typing a new action's name">
            <Switch value={settings.suggestions} onValueChange={(suggestions) => updateSettings({ suggestions })} trackColor={{ true: colors.accent, false: colors.fill }} accessibilityLabel="Suggest past actions" />
          </Row>
          <Row icon="albums-outline" title="Areas of importance" detail={`${areaCount} area${areaCount === 1 ? "" : "s"}`} onPress={() => setAreasSheet(true)} />
        </Group>

        {mobile && (
          <Group title="Reminders">
            <ReminderRow icon="moon-outline" title="Plan tomorrow" detail="An evening nudge to pick tomorrow's actions" reminder={settings.eveningReminder} onChange={(p) => setReminder("eveningReminder", p)} />
            <ReminderRow icon="sunny-outline" title="Start your day" detail="A morning nudge to finalize today's plan" reminder={settings.morningReminder} onChange={(p) => setReminder("morningReminder", p)} />
          </Group>
        )}

        {mobile && (
          <Group title="Backup" footer="Everything lives only on this phone. Export a backup now and then to keep it safe.">
            <Row icon="share-outline" title="Export backup" detail="Save a .json file to Files, AirDrop or email" onPress={handleExport} />
            <Row icon="download-outline" title="Restore from backup" detail="Replaces everything in the app" onPress={handleImport} />
          </Group>
        )}

        <Group title="Danger zone">
          <Row icon="calendar-outline" title="Clear today's plan" destructive onPress={() => clearDay("today")} />
          <Row icon="calendar-outline" title="Clear tomorrow's plan" destructive onPress={() => clearDay("tomorrow")} />
          <Row
            icon="trash-outline"
            title="Delete all actions"
            detail={`${actionCount} action${actionCount === 1 ? "" : "s"}`}
            destructive
            onPress={() => confirm("Delete all actions?", `All ${actionCount} actions will be removed, along with today's and tomorrow's picks. Areas and history are kept.`, "Delete all", clearActions)}
          />
        </Group>

        <AppText variant="footnote" tone="faint" style={styles.version}>
          LifeMastery {Constants.expoConfig?.version}
        </AppText>
      </ScrollView>
    </Screen>
  );
};

const Group: FC<{ title: string; footer?: string; children: ReactNode }> = ({ title, footer, children }) => {
  const colors = useTheme();
  const items = (Array.isArray(children) ? children : [children]).filter(Boolean);
  return (
    <View style={styles.group}>
      <AppText variant="footnote" weight="600" tone="muted" style={styles.groupTitle}>
        {title.toUpperCase()}
      </AppText>
      <View style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {items.map((child, i) => (
          <View key={i}>
            {i > 0 && <View style={[styles.separator, { backgroundColor: colors.border }]} />}
            {child}
          </View>
        ))}
      </View>
      {footer && (
        <AppText variant="footnote" tone="faint" style={styles.groupFooter}>
          {footer}
        </AppText>
      )}
    </View>
  );
};

// `stacked` puts the control under the title instead of beside it (for wide controls)
type RowT = { icon: IconNameT; title: string; detail?: string; onPress?: () => void; destructive?: boolean; stacked?: boolean; children?: ReactNode };

const Row: FC<RowT> = ({ icon, title, detail, onPress, destructive, stacked, children }) => {
  const colors = useTheme();
  const tone = destructive ? colors.danger : colors.text;

  const content = (
    <View style={[styles.row, stacked && styles.rowStacked]}>
      <View style={styles.rowMain}>
        <View style={[styles.iconBox, { backgroundColor: destructive ? colors.dangerSoft : colors.accentSoft }]}>
          <Ionicons name={icon} size={18} color={destructive ? colors.danger : colors.accent} />
        </View>
        <View style={styles.flex}>
          <AppText variant="body" color={tone}>
            {title}
          </AppText>
          {detail && (
            <AppText variant="footnote" tone="muted">
              {detail}
            </AppText>
          )}
        </View>
        {!stacked && children}
        {onPress && !destructive && <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />}
      </View>
      {stacked && <View style={styles.rowBelow}>{children}</View>}
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
      {content}
    </Pressable>
  );
};

const ReminderRow: FC<{ icon: IconNameT; title: string; detail: string; reminder: ReminderT; onChange: (patch: Partial<ReminderT>) => void }> = ({ icon, title, detail, reminder, onChange }) => {
  const colors = useTheme();
  return (
    <View>
      <Row icon={icon} title={title} detail={detail}>
        <Switch value={reminder.enabled} onValueChange={(enabled) => onChange({ enabled })} trackColor={{ true: colors.accent, false: colors.fill }} accessibilityLabel={title} />
      </Row>
      {reminder.enabled && (
        <View style={styles.reminderTime}>
          <AppText variant="callout" tone="muted" style={styles.flex}>
            Every day at
          </AppText>
          <Stepper label={`${title} time`} value={reminder.hour} onChange={(hour) => onChange({ hour })} min={0} max={23} format={formatHour} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: space.lg,
    paddingBottom: space.xxxl,
  },
  group: {
    marginTop: space.lg,
  },
  groupTitle: {
    marginBottom: space.sm,
    marginLeft: space.xs,
    letterSpacing: 0.5,
  },
  groupCard: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 52,
  },
  groupFooter: {
    marginTop: space.sm,
    marginHorizontal: space.xs,
  },
  row: {
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    minHeight: 56,
    justifyContent: "center",
  },
  rowStacked: {
    gap: space.md,
  },
  rowMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
  },
  rowBelow: {
    marginLeft: 40,
    alignItems: "flex-start",
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  segment: {
    width: "100%",
  },
  reminderTime: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 52,
    paddingRight: space.md,
    paddingBottom: space.md,
  },
  version: {
    textAlign: "center",
    marginTop: space.xxl,
  },
});
