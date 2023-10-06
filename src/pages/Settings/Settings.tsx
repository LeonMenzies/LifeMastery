import { SafeAreaView, Button } from "react-native";
import { useSetRecoilState } from "recoil";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { themeAtom, lightTheme, darkTheme } from "~recoil/themeAtom";
import { clearActions } from "~utils/ActionsHandler";
import { alertAtom } from "~recoil/alertAtom";
import { clearPlan } from "~utils/PlanHandler";

export const Settings = () => {
  const TODAY_PLAN = "today-plan";
  const TOMORROW_PLAN = "tomorrow-plan";

  const setTheme = useSetRecoilState(themeAtom);
  const setAlert = useSetRecoilState(alertAtom);

  return (
    <SafeAreaView>
      <Button title="Light mode" onPress={() => setTheme(lightTheme)} />
      <Button title="Dark mode" onPress={() => setTheme(darkTheme)} />
      <Button title="Clear Actions" onPress={() => clearActions(setAlert)} />
      <Button title="Clear Todays Plan" onPress={() => clearPlan(setAlert, TODAY_PLAN)} />
      <Button title="Clear Tomorrows Plan" onPress={() => clearPlan(setAlert, TOMORROW_PLAN)} />
      <Button title="Clear Everything" onPress={() => AsyncStorage.clear()} />
    </SafeAreaView>
  );
};
