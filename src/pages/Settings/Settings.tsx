import { View, StyleSheet } from "react-native";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { FC, useEffect } from "react";

import { darkTheme, lightTheme, themeAtom } from "~recoil/themeAtom";
import { clearActions } from "~utils/ActionsHandler";
import { alertAtom } from "~recoil/alertAtom";
import { clearPlan } from "~utils/PlanHandler";
import { SettingsT, ThemeT } from "~types/Types";
import { planAtom } from "~recoil/planAtom";
import { actionsAtom } from "~recoil/actionsAtom";
import { SettingsSelectItem } from "./SettingsSelectItem";
import { settingsAtom } from "~recoil/settingsAtom";
import { getSettings, saveSettings } from "~utils/SettingsHandler";
import { SettingsButtonItem } from "~pages/Settings/SettingsButtonItem";
import { SettingsSliderItem } from "./SettingsSliderItem";
import { Button } from "~components/Button";

export const Settings: FC<any> = () => {
  const TODAY_PLAN = "today-plan";
  const TOMORROW_PLAN = "tomorrow-plan";
  const setAlert = useSetRecoilState(alertAtom);
  const setPlan = useSetRecoilState(planAtom);
  const setActions = useSetRecoilState(actionsAtom);
  const [settings, setSettings] = useRecoilState(settingsAtom);
  const setTheme = useSetRecoilState(themeAtom);

  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  useEffect(() => {
    getSettings(setSettings);
  }, [settings]);

  const onChange = (settingName: string, value: boolean, numberValue: number = 0) => {
    let newSettings: SettingsT;

    switch (settingName) {
      case "lightMode":
        newSettings = { ...settings, lightMode: value };
        setTheme(value ? lightTheme : darkTheme);
        break;
      case "timePercent":
        newSettings = { ...settings, timePercent: value };
        break;
      case "maxPlanTime":
        newSettings = { ...settings, maxPlanTime: numberValue };
        break;
      case "autoComplete":
        newSettings = { ...settings, autoComplete: value };
        break;
      default:
        newSettings = settings;
    }

    setSettings(newSettings);
    saveSettings(newSettings);
  };

  return (
    <View style={styles.container}>
      <SettingsSelectItem title={settings.lightMode ? "Light Mode" : "Dark Mode"} callBack={(e) => onChange("lightMode", e)} value={settings.lightMode} />
      <SettingsSelectItem title={settings.timePercent ? "Time Complete" : "Tasks Complete"} callBack={(e) => onChange("timePercent", e)} value={settings.timePercent} />
      <SettingsSelectItem title={"Action Auto Complete"} callBack={(e) => onChange("autoComplete", e)} value={settings.autoComplete} />
      <SettingsSliderItem title={"Max Plan Time"} onChange={(e) => onChange("maxPlanTime", null, e)} value={settings.maxPlanTime} />
      <SettingsButtonItem title={"Clear Action"} buttonTitle={"Clear"} callBack={() => clearActions(setAlert, setActions)} />
      <SettingsButtonItem title={"Clear Todays Plan"} buttonTitle={"Clear"} callBack={() => clearPlan(setAlert, setPlan, TODAY_PLAN)} />
      <SettingsButtonItem title={"Clear Tomorrows Plan"} buttonTitle={"Clear"} callBack={() => clearPlan(setAlert, setPlan, TOMORROW_PLAN)} />
    </View>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      marginTop: 50,
      padding: 20,
    },
  });
