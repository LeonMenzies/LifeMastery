import { create } from "zustand";
import { SettingsT } from "~types/Types";

export const defaultSettings = {
  timePercent: true,
  lightMode: true,
  autoComplete: true,
  maxPlanTime: 16,
};

type SettingsStoreT = {
  settings: SettingsT;
  setSettings: (settings: SettingsT) => void;
};

export const useSettingsStore = create<SettingsStoreT>((set) => ({
  settings: defaultSettings,
  setSettings: (settings) => set({ settings }),
}));
