import "react-native-get-random-values";
import React, { useEffect, useState, FC } from "react";
import { StyleSheet, View } from "react-native";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";

import { Select } from "~components/Select";
import { getAreasOfImportance } from "~utils/AreasOfImportanceHandler";
import { addAction, updateAction } from "~utils/ActionsHandler";
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
  newAction: boolean;
};

export const ActionAddEdit: FC<ActionAddEditT> = ({ modalVisible, setModalVisible, newAction }) => {
  const setAlert = useSetRecoilState(alertAtom);
  const [actions, setActions] = useRecoilState(actionsAtom);
  const [areasOfImportance, setAreasOfImportance] = useRecoilState(areasOfImportanceAtom);
  const [actionItem, setActionItem] = useRecoilState<ActionItemT>(createActionAtom);
  const [timeHours, setTimeHours] = useState(0);
  const [timeMinutes, setTimeMinutes] = useState(0);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  useEffect(() => {
    setTimeHours(Math.floor(actionItem.timeEstimate / 60));
    setTimeMinutes(actionItem.timeEstimate % 60);
  }, [modalVisible]);

  useEffect(() => {
    const minutes = timeHours * 60 + timeMinutes;
    updateActionItem(actionItem, { timeEstimate: minutes });
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

  const createAutoCompleteText = () => {
    return actions.map((action: ActionItemT) => action.action);
  };

  const handleAddTodo = () => {
    if (!actionItem.action) {
      setAlert("Action is required");
      return;
    }

    if (actionItem.timeEstimate > 9 * 60) {
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

    newAction
      ? addAction(
          setAlert,
          setActions,
          actionItem.action,
          actionItem.timeEstimate,
          actionItem.areaOfImportance
        )
      : updateAction(setAlert, setActions, actionItem);

    newAction
      ? null
      : setModalVisible({
          show: false,
          newAction: true,
        });
    setActionItem(emptyAction);
  };

  const createOptions = () =>
    areasOfImportance && areasOfImportance.length > 0
      ? areasOfImportance.map((item) => ({ label: item.AOI, value: item.AOI }))
      : [{ label: "No AOI found, please add from the AOI tab", value: "" }];

  return (
    <Modal
      visible={modalVisible}
      onRequestClose={() =>
        setModalVisible({
          show: false,
          newAction: true,
        })
      }
    >
      <View>
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
          values={[timeHours]}
          showLabel={false}
        />
        <SliderInput
          title={"Minutes"}
          min={0}
          max={55}
          increment={5}
          markerColor={colors.primary}
          onChange={(values: number[]) => setTimeMinutes(values[0])}
          values={[timeMinutes]}
          showLabel={false}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title={newAction ? "Add" : "Save"} onPress={handleAddTodo} />
      </View>
    </Modal>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    buttonContainer: {
      padding: 30,
      flexDirection: "row",
    },
  });
