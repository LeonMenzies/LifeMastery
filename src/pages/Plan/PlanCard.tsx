import { StyleSheet, View, Text, Dimensions, ScrollView } from "react-native";
import { useEffect, useState, FC } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { alertAtom } from "~recoil/alertAtom";
import { getPlan, savePlan, finalizePlan } from "~utils/PlanHandler";
import { ThemeT, ActionItemT } from "~types/Types";
import { PlanActionsListItem } from "~pages/Plan/PlanActionsListItem";
import { Button } from "~components/Button";
import { themeAtom } from "~recoil/themeAtom";
import { planAtom } from "~recoil/planAtom";
import { actionsAtom } from "~recoil/actionsAtom";
import { TOMORROW_PLAN } from "~utils/Constants";
import { convertTime } from "~utils/Helpers";
import { navigatorAtom } from "~recoil/navigatorAtom";
import { settingsAtom } from "~recoil/settingsAtom";

type PlanCardT = {
  day: string;
};

export const PlanCard: FC<PlanCardT> = ({ day }) => {
  const setAlert = useSetRecoilState(alertAtom);
  const [data, setData] = useRecoilState(planAtom);
  const [actions, setActions] = useRecoilState(actionsAtom);

  const settings = useRecoilValue(settingsAtom);
  const colors = useRecoilValue(themeAtom);
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const styles = styling(colors, width, height);
  const setNavigator = useSetRecoilState(navigatorAtom);

  useEffect(() => {
    getPlan(setAlert, setData, day);
  }, [day]);

  const updateFocus = (newFocus: string) => {
    setData((prevData) => ({
      ...prevData,
      focus: newFocus,
    }));
  };

  const addActionKey = (actionKey: string) => {
    setData((prevData) => ({
      ...prevData,
      actionKeys: [...prevData.actionKeys, actionKey],
    }));
  };

  const removeActionKey = (actionKey: string) => {
    setData((prevData) => ({
      ...prevData,
      actionKeys: prevData.actionKeys.filter((key: string) => key !== actionKey),
    }));
  };

  const checkPlanLength = () => {
    let totalTime = 0;
    actions.forEach((action: ActionItemT) => {
      if (data.actionKeys.includes(action.key)) {
        totalTime += Number(action.timeEstimate);
      }
    });
    return totalTime;
  };

  const handleSave = () => {
    savePlan(setAlert, data, day);
  };

  const handleFinalize = () => {
    if (data.actionKeys.length < 1) {
      setAlert({ message: "You must add at least one action to your plan", type: "warning" });
      return;
    }

    if (checkPlanLength() > settings.maxPlanTime * 60) {
      setAlert({ message: "There isn't enough time in the day for all those actions, lets try again", type: "error" });
      setData((prevData) => ({
        ...prevData,
        actionKeys: [],
      }));
      return;
    }

    setData({ ...data, finalized: true });
    finalizePlan(setAlert, { ...data, finalized: true }, setHome, day);
  };

  const handleEdit = () => {
    setData({ ...data, finalized: false });
    finalizePlan(setAlert, { ...data, finalized: false }, () => {}, day);
  };

  const setHome = () => {
    setNavigator("home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.plainItemsContainer}>
        <ScrollView>
          {actions.length > 0 ? (
            actions.map((item: ActionItemT, index: number) => {
              const isInPlan = data.actionKeys.some((actionKey: string) => actionKey === item.key);
              if (!item.isCompleted || isInPlan)
                return <PlanActionsListItem key={index} item={item} setActions={setActions} addAction={addActionKey} removeAction={removeActionKey} isInPlan={isInPlan} finalized={data.finalized} />;
            })
          ) : (
            <Text style={{ color: colors.grey, marginTop: 50 }}>No Actions</Text>
          )}
        </ScrollView>

        <View style={styles.bottomContainer}>
          <View style={styles.totalTimeContainer}>
            <Text style={styles.totalTimeText}>Total: {convertTime(checkPlanLength())}</Text>
          </View>
          <View style={styles.buttonContainer}>
            {data.finalized ? (
              <Button title="Edit" onPress={handleEdit} disabled={false} />
            ) : day === TOMORROW_PLAN ? (
              <Button title="Save" onPress={handleSave} disabled={data.finalized || data.actionKeys.length == 0} />
            ) : (
              <Button title="Finalize" onPress={handleFinalize} disabled={data.finalized || day === TOMORROW_PLAN || data.actionKeys.length == 0} />
            )}
          </View>
        </View>
      </View>
      {data.finalized && (
        <View style={styles.centeredView}>
          <View style={styles.finalizedContainer}>
            <Text style={styles.finalizedText}>{"Day is Finalized"}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styling = (colors: ThemeT, width: number, height: number) =>
  StyleSheet.create({
    container: {
      height: "100%",
      alignItems: "center",
    },
    plainItemsContainer: {
      flex: 1,
      alignItems: "center",
    },
    bottomContainer: {
      width: width - 50,
      zIndex: 20,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "center",
    },
    centeredView: {
      flex: 1,
      top: "20%",
      alignItems: "center",
      position: "absolute",
      zIndex: 1,
    },
    finalizedContainer: {
      transform: [{ rotate: "30deg" }],
      borderRadius: 5,
      borderColor: colors.error,
      borderWidth: 2,
    },
    finalizedText: {
      fontSize: 17,
      padding: 5,
      color: colors.error,
    },
    totalTimeContainer: {
      paddingRight: 10,
      alignItems: "flex-end",
    },
    totalTimeText: {
      paddingTop: 5,
      fontSize: 17,
      color: colors.textPrimary,
    },
  });
