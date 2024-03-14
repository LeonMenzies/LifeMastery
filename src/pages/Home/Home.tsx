import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState, FC } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import DraggableFlatList from "react-native-draggable-flatlist";
import { HomeHeader } from "~pages/Home/HomeHeader";
import { actionsAtom } from "~recoil/actionsAtom";
import { alertAtom } from "~recoil/alertAtom";
import { getActions } from "~utils/ActionsHandler";
import { getAreasOfImportance, setAreasOfImportanceOrder } from "~utils/AreasOfImportanceHandler";
import { HomeActionSection } from "~pages/Home/HomeActionSection";
import { PlanT, ThemeT, ActionItemT } from "~types/Types";
import { getPlan, updatePlan } from "~utils/PlanHandler";
import { planAtom } from "~recoil/planAtom";
import { themeAtom } from "~recoil/themeAtom";
import { settingsAtom } from "~recoil/settingsAtom";
import { TODAY_PLAN } from "~utils/Constants";
import { getTheme } from "~utils/SettingsHandler";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const Home: FC<any> = () => {
  const setAlert = useSetRecoilState(alertAtom);
  const [plan, setPlan] = useRecoilState<PlanT>(planAtom);
  const [actions, setActions] = useRecoilState(actionsAtom);
  const [areasOfImportance, setAreasOfImportance] = useState([]);
  const [percent, setPercent] = useState(0);
  const setTheme = useSetRecoilState(themeAtom);
  const settings = useRecoilValue(settingsAtom);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);
  const totalTime: number = actions.reduce((total: number, action: ActionItemT) => {
    let toAdd = 0;
    if (plan.actionKeys.includes(action.key)) {
      toAdd = Number(action.timeEstimate);
    }
    return total + toAdd;
  }, 0);

  useEffect(() => {
    getAreasOfImportance(setAlert, setAreasOfImportance);
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

    const denominator = settings.timePercent ? totalTime : plan.actionKeys.length;
    const numerator = settings.timePercent ? completeTime : completeTasks;

    const calculatedPercent = denominator !== 0 && !isNaN(denominator) ? (numerator / denominator) * 100 : 0;

    // Not using this logic for now
    // if (calculatedPercent == 100) {
    //   updatePlan(setAlert, setPlan, { ...plan, complete: true }, TODAY_PLAN);
    // }
    setPercent(calculatedPercent);
  }, [actions]);

  return (
    <View style={styles.container}>
      <HomeHeader percent={percent} totalTime={totalTime} />
      <GestureHandlerRootView style={{ flex: 1, marginTop: 20 }}>
        {plan.finalized ? (
          <View>
            <DraggableFlatList
              data={areasOfImportance}
              keyExtractor={(item) => `draggable-item-${item.key}`}
              renderItem={({ item, drag, isActive }) => (
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    backgroundColor: isActive ? "rgba(0, 0, 0, 0.1)" : item.backgroundColor,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onLongPress={drag}
                >
                  <HomeActionSection key={item.key} aoi={item} data={actions} setActions={setActions} actionKeys={plan.actionKeys} />
                </TouchableOpacity>
              )}
              onDragEnd={({ data }) => setAreasOfImportanceOrder(setAlert, setAreasOfImportance, data)}
            />
          </View>
        ) : (
          <View style={{ marginTop: 100 }}>
            <Text style={{ color: colors.grey, marginTop: 50 }}>No Plan Finalized For Today</Text>
          </View>
        )}

        {plan.complete && (
          <View style={styles.completeContainer}>
            <Text style={styles.completeText}>{"Day is Complete"}</Text>
          </View>
        )}
      </GestureHandlerRootView>
    </View>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      height: "100%",
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
