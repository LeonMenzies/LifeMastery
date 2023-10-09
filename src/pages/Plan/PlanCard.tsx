import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import DraggableFlatList from "react-native-draggable-flatlist";

import { alertAtom } from "~recoil/alertAtom";
import { TextInput } from "~components/TextInput";
import { getPlan, savePlan, finalizePlan } from "~utils/PlanHandler";
import { PlanT, ThemeT, ActionItemT } from "~types/Types";
import { PlanActionsListItem } from "~pages/Plan/PlanActionsListItem";
import { Button } from "~components/Button";
import { themeAtom } from "~recoil/themeAtom";
import { planAtom } from "~recoil/planAtom";
import { actionsAtom } from "~recoil/actionsAtom";
import { updateAction } from "~utils/ActionsHandler";

type PlanCardT = {
  day: string;
  navigation: any;
};

export const PlanCard = ({ day, navigation }: PlanCardT) => {
  const setAlert = useSetRecoilState(alertAtom);
  const [data, setData] = useRecoilState(planAtom);
  const [actions, setActions] = useRecoilState(actionsAtom);

  const [text, setText] = useState("");
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);
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

    finalizePlan(
      setAlert,
      { ...data, finalized: true, date: new Date().toISOString().split("T")[0] },
      navigation,
      day
    );
  };

  const renderItem = ({ item, drag, isActive }) => {
    const isInPlan = data.actionKeys.some((actionKey: string) => actionKey === item.key);

    return (
      <PlanActionsListItem
        item={item}
        drag={drag}
        isActive={isActive}
        setActions={setActions}
        addAction={addActionKey}
        removeAction={removeActionKey}
        isInPlan={isInPlan}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.focusContainer}>
          <TextInput
            title={"Focus"}
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
            <DraggableFlatList
              style={styles.actionsList}
              data={actions}
              onDragEnd={({ data }) => setActions(data)}
              keyExtractor={(item) => item.key}
              renderItem={renderItem}
            />
            <View style={styles.totalTimeContainer}>
              <Text style={styles.totalTimeText}>Total: {checkPlanLength()}</Text>
            </View>
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
      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={handleSave} disabled={data.finalized} />
        <Button title="Finalize" onPress={handleFinalize} disabled={data.finalized} />
      </View>
    </View>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      alignContent: "space-between",
      height: "75%",
    },
    focusContainer: {
      padding: 10,
      margin: 10,
      backgroundColor: colors.lightGrey,
      borderColor: colors.grey,
      borderWidth: 1,
      borderRadius: 10,
    },
    actionsList: {
      height: "88%", //TODO: fix this meh
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "center",
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
    },
  });
