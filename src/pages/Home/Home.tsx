import { StyleSheet, ScrollView, View, Text, ActivityIndicator } from "react-native";
import { useEffect, useState, FC } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { HomeHeader } from "~pages/Home/HomeHeader";
import { actionsAtom } from "~recoil/actionsAtom";
import { alertAtom } from "~recoil/alertAtom";
import { getActions } from "~utils/ActionsHandler";
import { getAreasOfImportance } from "~utils/AreasOfImportanceHandler";
import { HomeActionSection } from "~pages/Home/HomeActionSection";
import { AreaOfImportanceItemT, PlanT, ThemeT, ActionItemT } from "~types/Types";
import { getPlan, updatePlan } from "~utils/PlanHandler";
import { planAtom } from "~recoil/planAtom";
import { darkTheme, lightTheme, themeAtom } from "~recoil/themeAtom";
import { settingsAtom } from "~recoil/settingsAtom";
import { TODAY_PLAN } from "~utils/Constants";
import { navigatorAtom } from "~recoil/navigatorAtom";
import { getSettings, getTheme } from "~utils/SettingsHandler";

export const Home: FC<any> = () => {
  const setAlert = useSetRecoilState(alertAtom);
  const [plan, setPlan] = useRecoilState<PlanT>(planAtom);
  const [actions, setActions] = useRecoilState(actionsAtom);
  const [areasOfImportance, setAreasOfImportance] = useState([]);
  const [percent, setPercent] = useState(0);
  const setNavigator = useSetRecoilState(navigatorAtom);
  const setTheme = useSetRecoilState(themeAtom);
  const [settings, setSettings] = useRecoilState(settingsAtom);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  useEffect(() => {
    if (!plan.finalized) {
      setAlert("You must finalize today first");
      setNavigator("plan");
    } else {
      getAreasOfImportance(setAlert, setAreasOfImportance);
    }
  }, [plan]);

  useEffect(() => {
    getTheme(setTheme);
    getPlan(setAlert, setPlan, TODAY_PLAN);
    getActions(setAlert, setActions);
  }, []);

  useEffect(() => {
    let completeTasks = 0;
    let completeTime = 0;
    let totalTime = 0;

    actions.forEach((action: ActionItemT) => {
      if (plan.actionKeys.includes(action.key)) {
        totalTime += Number(action.timeEstimate);
        if (action.isCompleted) {
          completeTasks++;
          completeTime += Number(action.timeEstimate);
        }
      }
    });

    const calculatedPercent = settings.timePercent
      ? (completeTime / totalTime) * 100
      : (completeTasks / plan.actionKeys.length) * 100;

    if (calculatedPercent == 100) {
      updatePlan(setAlert, setPlan, { ...plan, complete: true }, TODAY_PLAN);
    }
    setPercent(calculatedPercent);
  }, [actions]);

  return (
    <View style={styles.container}>
      <HomeHeader focus={plan.focus} percent={percent} />

      <ScrollView>
        {areasOfImportance.map((aoi: AreaOfImportanceItemT) => (
          <HomeActionSection
            key={aoi.key}
            aoi={aoi}
            data={actions}
            setActions={setActions}
            actionKeys={plan.actionKeys}
          />
        ))}
      </ScrollView>
      {plan.complete && (
        <View style={styles.completeContainer}>
          <Text style={styles.completeText}>{"Day is Complete"}</Text>
        </View>
      )}
    </View>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      height: "100%",
      alignItems: "center",
    },
    completeContainer: {
      borderRadius: 5,
      borderColor: colors.success,
      borderWidth: 2,
      marginBottom: 30,
    },
    completeText: {
      fontSize: 17,
      padding: 5,
      color: colors.success,
    },
  });
