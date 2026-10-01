import { useEffect } from "react";
import { Platform } from "react-native";
import * as ExpoNotifications from "expo-notifications";

import { useSettingsStore } from "~store/settingsStore";
import { ReminderT } from "~types/Types";

const supported = Platform.OS === "ios" || Platform.OS === "android";

if (supported) {
  ExpoNotifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
  });
}

export const requestReminderPermission = async () => {
  if (!supported) return false;
  const current = await ExpoNotifications.getPermissionsAsync();
  if (current.granted) return true;
  const asked = await ExpoNotifications.requestPermissionsAsync();
  return asked.granted;
};

const schedule = (reminder: ReminderT, title: string, body: string) =>
  ExpoNotifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { type: ExpoNotifications.SchedulableTriggerInputTypes.DAILY, hour: reminder.hour, minute: 0 },
  });

const syncReminders = async (evening: ReminderT, morning: ReminderT) => {
  await ExpoNotifications.cancelAllScheduledNotificationsAsync();
  if (!evening.enabled && !morning.enabled) return;
  if (!(await ExpoNotifications.getPermissionsAsync()).granted) return;
  if (evening.enabled) await schedule(evening, "Plan tomorrow", "Take two minutes to pick tomorrow's actions.");
  if (morning.enabled) await schedule(morning, "Here's your day", "Check your plan and finalize today.");
};

// Keeps the scheduled daily reminders in step with Settings.
export const useReminderSync = () => {
  const evening = useSettingsStore((s) => s.settings.eveningReminder);
  const morning = useSettingsStore((s) => s.settings.morningReminder);

  useEffect(() => {
    if (supported) syncReminders(evening, morning).catch((e) => console.warn("Failed to schedule reminders", e));
  }, [evening.enabled, evening.hour, morning.enabled, morning.hour]);
};
