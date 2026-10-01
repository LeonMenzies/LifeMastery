import { FC, useEffect } from "react";
import { AppState, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-root-toast";
import { StatusBar } from "expo-status-bar";

import { AppText } from "~components/AppText";
import { IconNameT } from "~components/IconButton";
import { ActionAddEdit } from "~components/ActionAddEdit";
import { Home } from "~pages/Home/Home";
import { Plan } from "~pages/Plan/Plan";
import { ActionsList } from "~pages/ActionsList/ActionsList";
import { Settings } from "~pages/Settings/Settings";
import { AreasOfImportance } from "~pages/AreasOfImportance/AreasOfImportance";
import { useAlertStore, defaultAlert } from "~store/alertStore";
import { useDataStore } from "~store/dataStore";
import { TabT, useUiStore } from "~store/uiStore";
import { radius, space, useTheme } from "~theme/Theme";
import { haptic } from "~utils/Haptics";
import { useReminderSync } from "~utils/Notifications";

const TABS: { key: TabT; title: string; icon: IconNameT; activeIcon: IconNameT; component: FC }[] = [
  { key: "home", title: "Today", icon: "sunny-outline", activeIcon: "sunny", component: Home },
  { key: "plan", title: "Plan", icon: "calendar-outline", activeIcon: "calendar", component: Plan },
  { key: "actions", title: "Actions", icon: "list-outline", activeIcon: "list", component: ActionsList },
  { key: "settings", title: "Settings", icon: "settings-outline", activeIcon: "settings", component: Settings },
];

export const Navigator: FC = () => {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const tab = useUiStore((s) => s.tab);
  const setTab = useUiStore((s) => s.setTab);
  const alert = useAlertStore((s) => s.alert);
  const setAlert = useAlertStore((s) => s.setAlert);
  const rollover = useDataStore((s) => s.rollover);

  useReminderSync();

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => state === "active" && rollover());
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (alert.message === "") return;
    const timerId = setTimeout(() => setAlert(defaultAlert), 3000);
    return () => clearTimeout(timerId);
  }, [alert]);

  const alertColors = {
    info: colors.text,
    success: colors.success,
    warning: colors.warning,
    error: colors.danger,
  };

  const Page = TABS.find((t) => t.key === tab).component;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.dark ? "light" : "dark"} />
      <View style={styles.page}>
        <Page />
      </View>

      <View accessibilityRole="tablist" style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, space.sm), backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        {TABS.map((t) => {
          const active = t.key === tab;
          return (
            <Pressable
              key={t.key}
              accessibilityRole="tab"
              accessibilityLabel={t.title}
              accessibilityState={{ selected: active }}
              style={styles.tab}
              onPress={() => {
                if (!active) haptic.tap();
                setTab(t.key);
              }}
            >
              <Ionicons name={active ? t.activeIcon : t.icon} size={24} color={active ? colors.accent : colors.textFaint} />
              <AppText variant="caption" color={active ? colors.accent : colors.textMuted}>
                {t.title}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <ActionAddEdit />
      <AreasOfImportance />

      <Toast
        visible={alert.message !== ""}
        position={insets.top + space.sm}
        shadow={false}
        animation
        hideOnPress
        opacity={1}
        backgroundColor={alertColors[alert.type]}
        textColor={colors.background}
        containerStyle={styles.toast}
        textStyle={styles.toastText}
      >
        {alert.message}
      </Toast>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: space.sm,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 2,
    minHeight: 44,
  },
  toast: {
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    marginHorizontal: space.lg,
  },
  toastText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
