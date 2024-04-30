import "react-native-get-random-values";
import React, { useEffect, useState, FC } from "react";
import { StyleSheet, View } from "react-native";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";

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
import { Picker } from "./Picker";
import { RepeatSelector } from "./RepeatSelector";
import { RepeatInput } from "./RepeatInput";

type ActionAddEditT = {
  modalVisible: {
    show: boolean;
    newAction: boolean;
  };
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
    if (modalVisible.newAction) {
      setActionItem({
        ...actionItem,
        areaOfImportance: createOptions()[0].value,
        action: "",
        timeEstimate: 0,
      });
    }
  }, [modalVisible]);

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

  const handleAddTodo = () => {
    if (!actionItem.action) {
      setAlert({ message: "Action is required", type: "warning" });
      return;
    }

    if (actionItem.timeEstimate > 9 * 60) {
      setAlert({ message: "Time estimate cannot be over 9 hours", type: "error" });
      return;
    }

    if (!actionItem.areaOfImportance || actionItem.areaOfImportance === "No AOI found") {
      setAlert({ message: "Area of Importance is required", type: "warning" });
      return;
    }

    modalVisible.newAction
      ? addAction(setAlert, setActions, actionItem.action, actionItem.timeEstimate, actionItem.areaOfImportance, actionItem.repeat)
      : updateAction(setAlert, setActions, actionItem);

    modalVisible.newAction
      ? null
      : setModalVisible({
          show: false,
          newAction: true,
        });
    setActionItem({
      ...actionItem,
      areaOfImportance: createOptions()[0].value,
      action: "",
      timeEstimate: 0,
    });
    setTimeHours(0);
    setTimeMinutes(0);
  };

  const createOptions = () => (areasOfImportance && areasOfImportance.length > 0 ? areasOfImportance.map((item) => ({ label: item.AOI, value: item.AOI })) : [{ label: "No AOI found", value: "" }]);

  const createAutoCompleteText = () => {
    return actions.map((action: ActionItemT) => action.action);
  };

  return (
    <Modal
      visible={modalVisible.show}
      onRequestClose={() =>
        setModalVisible({
          show: false,
          newAction: true,
        })
      }
    >
      <View style={styles.container}>
        <TextInputAutoComplete
          title={"Action"}
          onChangeText={(e) => updateActionItem(actionItem, { action: e })}
          value={actionItem.action}
          placeholder="Add value..."
          keyboardType="default"
          maxLength={30}
          autoCompleteText={createAutoCompleteText()}
        />
        <Picker title={"Area of Importance"} options={createOptions()} value={actionItem.areaOfImportance} onChange={(e) => updateActionItem(actionItem, { areaOfImportance: e })} />
        <SliderInput title={"Hours"} min={0} max={12} increment={1} markerColor={colors.primary} onChange={(value: number) => setTimeHours(value)} value={timeHours} showLabel={false} />
        <SliderInput title={"Minutes"} min={0} max={55} increment={5} markerColor={colors.primary} onChange={(value: number) => setTimeMinutes(value)} value={timeMinutes} showLabel={false} />
        <RepeatInput title={"Repeat"} value={actionItem.repeat} onValueChange={(e) => updateActionItem(actionItem, { repeat: e })} />
        <View style={styles.buttonContainer}>
          <Button title={modalVisible.newAction ? "Add" : "Save"} onPress={handleAddTodo} />
        </View>
      </View>
    </Modal>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      width: "90%",
      alignItems: "center",
    },
    buttonContainer: {
      paddingBottom: 20,
      flexDirection: "row",
    },
  });
