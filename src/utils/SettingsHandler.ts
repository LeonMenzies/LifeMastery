import AsyncStorage from "@react-native-async-storage/async-storage";

import { defaultSettings } from "~recoil/settingsAtom";
import { darkTheme, lightTheme } from "~recoil/themeAtom";
import { SettingsT } from "~types/Types";
import { SETTINGS } from "~utils/Constants";

export const getSettings = (setData: Function) => {
  try {
    AsyncStorage.getItem(SETTINGS)
      .then((settings) => JSON.parse(settings))
      .then((settings: SettingsT) => {
        if (settings === null) {
          setData(defaultSettings);
        } else {
          setData(settings);
        }
      });
  } catch (e) {
    console.log("Failed to get settings");
  }
};
export const getTheme = (setData: Function) => {
  try {
    AsyncStorage.getItem(SETTINGS)
      .then((settings) => JSON.parse(settings))
      .then((settings: SettingsT) => {
        if (settings === null) {
          setData(lightTheme);
        } else {
          setData(settings.lightMode ? lightTheme : darkTheme);
        }
      });
  } catch (e) {
    console.log("Failed to get settings");
  }
};

export const saveSettings = (settings: SettingsT) => {
  try {
    const settingsJson = JSON.stringify(settings);
    AsyncStorage.setItem(SETTINGS, settingsJson);
  } catch (e) {
    console.log("Failed to set settings");
  }
};
