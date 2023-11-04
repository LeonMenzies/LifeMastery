import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Dimensions,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
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
import { themeAtom } from "~recoil/themeAtom";
import { settingsAtom } from "~recoil/settingsAtom";
import { TODAY_PLAN } from "~utils/Constants";

export const Home: FC<any> = ({ navigation }) => {
  const setAlert = useSetRecoilState(alertAtom);
  const [plan, setPlan] = useRecoilState<PlanT>(planAtom);
  const [actions, setActions] = useRecoilState(actionsAtom);
  const [areasOfImportance, setAreasOfImportance] = useState([]);
  const [loading, setLoading] = useState(true);
  const settings = useRecoilValue(settingsAtom);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  useEffect(() => {
    if (!loading && !plan.finalized) {
      setAlert("You must finalize today first");
      navigation.navigate("Plan");
    } else {
      getAreasOfImportance(setAlert, setAreasOfImportance);
    }
  }, [plan]);

  useEffect(() => {
    getPlan(setAlert, setPlan, TODAY_PLAN, setLoading);
    getActions(setAlert, setActions);
  }, []);

  const calculatePercent = () => {
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

    return settings.timePercent
      ? (completeTime / totalTime) * 100
      : (completeTasks / plan.actionKeys.length) * 100;
  };

  // const checkComplete = () => {
  //   if (percent === 100) updatePlan(setAlert, setPlan, { ...plan, complete: true }, TODAY_PLAN);
  // };

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader focus={plan.focus} percent={calculatePercent()} />
      {loading && <ActivityIndicator size="large" color={colors.primary} />}

      <ScrollView>
        {areasOfImportance.map((aoi: AreaOfImportanceItemT) => {
          return (
            <HomeActionSection
              key={aoi.key}
              aoi={aoi}
              data={actions}
              setActions={setActions}
              actionKeys={plan.actionKeys}
            />
          );
        })}
      </ScrollView>
      {plan.complete && (
        <View style={styles.completeContainer}>
          <Text style={styles.completeText}>{"Day is Complete"}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
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
