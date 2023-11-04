import "react-native-get-random-values";
import React, { useEffect, useState, FC } from "react";
import { StyleSheet, View } from "react-native";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";

import { Select } from "~components/Select";
import { getAreasOfImportance } from "~utils/AreasOfImportanceHandler";
import { addAction, updateAction } from "~utils/ActionsHandler";
import { TextInput } from "~components/TextInput";
import { alertAtom } from "~recoil/alertAtom";
import { actionsAtom } from "~recoil/actionsAtom";
import { areasOfImportanceAtom } from "~recoil/areasOfImportanceAtom";
import { Button } from "~components/Button";
import { ThemeT, ActionItemT } from "~types/Types";
import { themeAtom } from "~recoil/themeAtom";
import { TextInputAutoComplete } from "./TextInputAutoComplete";
import { SliderInput } from "./SliderInput";
import { Modal } from "./Modal";
import { createActionAtom, emptyAction } from "~recoil/createActionAtom";

type ActionAddEditT = {
  modalVisible: boolean;
  setModalVisible: any;
};

export const ActionAddEdit: FC<ActionAddEditT> = ({ modalVisible, setModalVisible }) => {
  const setAlert = useSetRecoilState(alertAtom);
  const [actions, setActions] = useRecoilState(actionsAtom);
  const [areasOfImportance, setAreasOfImportance] = useRecoilState(areasOfImportanceAtom);
  const [actionItem, setActionItem] = useRecoilState<ActionItemT>(createActionAtom);
  const [timeHours, setTimeHours] = useState(0);
  const [timeMinutes, setTimeMinutes] = useState(0);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  useEffect(() => {
    const decimalHours = timeHours + timeMinutes / 60;
    updateActionItem(actionItem, { timeEstimate: decimalHours });
  }, [timeHours, timeMinutes]);

  useEffect(() => {
    getAreasOfImportance(setAlert, setAreasOfImportance);
  }, [actionItem.action]);

  const updateActionItem = (originalAction: ActionItemT, updates: Partial<ActionItemT>) => {
    setActionItem({
      ...originalAction,
      ...updates,
    });
  };

  const convertTime = (decimalHours: number): { hours: number; minutes: number } => {
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    return { hours: hours, minutes: minutes };
  };

  const createAutoCompleteText = () => {
    return actions.map((action: ActionItemT) => action.action);
  };

  const handleAddTodo = () => {
    if (!actionItem.action) {
      setAlert("Action is required");
      return;
    }

    if (actionItem.timeEstimate > 9) {
      setAlert("Time estimate cannot be over 9 hours");
      return;
    }

    if (
      !actionItem.areaOfImportance ||
      actionItem.areaOfImportance === "No AOI found, please add from the AOI tab"
    ) {
      setAlert("Area of Importance is required");
      return;
    }

    actionItem.action
      ? updateAction(setAlert, setActions, actionItem)
      : addAction(
          setAlert,
          setActions,
          actionItem.action,
          actionItem.timeEstimate,
          actionItem.areaOfImportance
        );
    actionItem.action ? setModalVisible(false) : null;
    setActionItem(emptyAction);
  };

  const createOptions = () =>
    areasOfImportance && areasOfImportance.length > 0
      ? areasOfImportance.map((item) => ({ label: item.AOI, value: item.AOI }))
      : [{ label: "No AOI found, please add from the AOI tab", value: "" }];

  return (
    <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
      <Select
        title={"Area of Importance"}
        options={createOptions()}
        value={actionItem.areaOfImportance}
        onChange={(e) => updateActionItem(actionItem, { areaOfImportance: e })}
      />
      <TextInputAutoComplete
        title={"Action"}
        onChangeText={(e) => updateActionItem(actionItem, { action: e })}
        value={actionItem.action}
        placeholder="Add value..."
        keyboardType="default"
        maxLength={30}
        autoCompleteText={createAutoCompleteText()}
      />
      <SliderInput
        title={"Hours"}
        min={0}
        max={12}
        increment={1}
        markerColor={colors.primary}
        onChange={(values: number[]) => setTimeHours(values[0])}
        values={[convertTime(actionItem.timeEstimate).hours]}
        showLabel={false}
      />
      <SliderInput
        title={"Minutes"}
        min={0}
        max={60}
        increment={5}
        markerColor={colors.primary}
        onChange={(values: number[]) => setTimeMinutes(values[0])}
        values={[convertTime(actionItem.timeEstimate).minutes]}
        showLabel={false}
      />
      <View style={styles.buttonContainer}>
        <Button title={actionItem.action ? "Save" : "Add"} onPress={handleAddTodo} />
        <Button title="Close" onPress={() => setModalVisible(false)} />
      </View>
    </Modal>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
      margin: 20,
      backgroundColor: colors.background,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      elevation: 5,
    },
    buttonContainer: {
      padding: 10,
      flexDirection: "row",
    },
  });
