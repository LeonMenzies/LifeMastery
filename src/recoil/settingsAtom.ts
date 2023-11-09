import { atom } from "recoil";
import { SettingsT } from "~types/Types";

export const defaultSettings = {
  timePercent: true,
  lightMode: true,
};

export const settingsAtom = atom<SettingsT>({
  key: "settings",
  default: defaultSettings,
});
