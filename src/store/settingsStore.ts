import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { SettingsT } from "~types/Types";
import { SETTINGS_KEY, STORE_VERSION } from "~utils/Constants";

export const defaultSettings: SettingsT = {
  appearance: "system",
  progressBy: "time",
  maxPlanHours: 16,
  suggestions: true,
  eveningReminder: { enabled: false, hour: 20 },
  morningReminder: { enabled: false, hour: 7 },
};

type SettingsStoreT = {
  settings: SettingsT;
  updateSettings: (patch: Partial<SettingsT>) => void;
  replaceSettings: (settings: SettingsT) => void;
};

export const useSettingsStore = create<SettingsStoreT>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      replaceSettings: (settings) => set({ settings: { ...defaultSettings, ...settings } }),
    }),
    {
      name: SETTINGS_KEY,
      version: STORE_VERSION,
      storage: createJSONStorage(() => AsyncStorage),
      skipHydration: true,
      merge: (persisted: any, current) => ({ ...current, settings: { ...defaultSettings, ...persisted?.settings } }),
      partialize: (s) => ({ settings: s.settings }),
    },
  ),
);
