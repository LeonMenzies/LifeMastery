import { StyleSheet, View, Text, ActivityIndicator, Dimensions } from "react-native";
import { useEffect, useState, FC } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { alertAtom } from "~recoil/alertAtom";
import { TextInput } from "~components/TextInput";
import { getPlan, savePlan, finalizePlan } from "~utils/PlanHandler";
import { PlanT, ThemeT, ActionItemT } from "~types/Types";
import { PlanActionsListItem } from "~pages/Plan/PlanActionsListItem";
import { Button } from "~components/Button";
import { themeAtom } from "~recoil/themeAtom";
import { planAtom } from "~recoil/planAtom";
import { actionsAtom } from "~recoil/actionsAtom";
import { TOMORROW_PLAN } from "~utils/Constants";
import { convertTime } from "~utils/Helpers";

type PlanCardT = {
  day: string;
};

export const PlanCard: FC<PlanCardT> = ({ day }) => {
  const setAlert = useSetRecoilState(alertAtom);
  const [data, setData] = useRecoilState(planAtom);
  const [actions, setActions] = useRecoilState(actionsAtom);
  const [text, setText] = useState("");
  const colors = useRecoilValue(themeAtom);
  const windowWidth = Dimensions.get("window").width;
  const styles = styling(colors, windowWidth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlan(setAlert, setData, day, setLoading);
  }, [day]);

  useEffect(() => {
    setText(data.focus);
  }, [data]);

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
      setAlert("You must add at least one action to your plan");
      return;
    }

    if (checkPlanLength() > 16) {
      setAlert("There isn't enough time in the day for all those actions, lets try again");
      setData((prevData) => ({
        ...prevData,
        actionKeys: [],
      }));
      return;
    }

    if (!text) {
      setAlert("Focus is required");
      return;
    }

    finalizePlan(setAlert, { ...data, finalized: true }, setHome, day);
  };

  const setHome = () => {};

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.focusContainer}>
          <TextInput
            title={"My Key Focus For Today"}
            onChangeText={updateFocus}
            value={text}
            placeholder="Add focus..."
            keyboardType="default"
            maxLength={30}
          />
        </View>
        {loading && <ActivityIndicator size="large" color={colors.primary} />}

        {actions.length > 0 ? (
          <View>
            {actions.map((item: ActionItemT, index: number) => (
              <PlanActionsListItem
                key={index}
                item={item}
                setActions={setActions}
                addAction={addActionKey}
                removeAction={removeActionKey}
                isInPlan={data.actionKeys.some((actionKey: string) => actionKey === item.key)}
              />
            ))}

            {data.finalized && (
              <View style={styles.centeredView}>
                <View style={styles.finalizedContainer}>
                  <Text style={styles.finalizedText}>{"Day is Finalized"}</Text>
                </View>
              </View>
            )}
          </View>
        ) : (
          <Text>No Actions in your list</Text>
        )}
      </View>

      {!loading && (
        <View>
          <View style={styles.totalTimeContainer}>
            <Text style={styles.totalTimeText}>Total: {convertTime(checkPlanLength())}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Save" onPress={handleSave} disabled={data.finalized} />
            <Button
              title="Finalize"
              onPress={handleFinalize}
              disabled={data.finalized || day === TOMORROW_PLAN}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styling = (colors: ThemeT, windowWidth: number) =>
  StyleSheet.create({
    container: {
      justifyContent: "space-between",
      alignItems: "center",
      flex: 1,
    },
    focusContainer: {
      padding: 10,
      margin: 10,
      backgroundColor: colors.primary,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "center",
      width: windowWidth - 50,
    },
    centeredView: {
      flex: 1,
      height: "100%",
      width: "100%",
      top: "20%",
      alignItems: "center",
      position: "absolute",
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
      alignItems: "flex-end",
    },
    totalTimeText: {
      paddingTop: 5,
      fontSize: 17,
      color: colors.textPrimary,
    },
  });
