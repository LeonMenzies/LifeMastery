import "react-native-get-random-values";
import React, { useEffect, useState, FC } from "react";
import { StyleSheet, View } from "react-native";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";
import Slider from "react-native-a11y-slider";

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
import { TimePicker } from "~components/TimePicker";
import { TextInputAutoComplete } from "./TextInputAutoComplete";
import { SliderInput } from "./SliderInput";
import { Modal } from "./Modal";

type ActionAddEditT = {
  modalVisible: {
    show: boolean;
    action: ActionItemT;
  };
  setModalVisible: any;
};

export const ActionAddEdit: FC<ActionAddEditT> = ({ modalVisible, setModalVisible }) => {
  const setAlert = useSetRecoilState(alertAtom);
  const [actions, setActions] = useRecoilState(actionsAtom);
  const [areasOfImportance, setAreasOfImportance] = useRecoilState(areasOfImportanceAtom);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  const [action, setAction] = useState("");
  const [timeEstimate, setTimeEstimate] = useState(0);

  const [timeHours, setTimeHours] = useState(1);
  const [timeMinutes, setTimeMinutes] = useState(0);

  const [areaOfImportance, setAreaOfImportance] = useState("");

  useEffect(() => {
    const decimalHours = timeHours + timeMinutes / 60;
    setTimeEstimate(decimalHours);
  }, [timeHours, timeMinutes]);

  useEffect(() => {
    getAreasOfImportance(setAlert, setAreasOfImportance);
  }, [modalVisible.action.action]);

  useEffect(() => {
    setAreaOfImportance(modalVisible.action.areaOfImportance);
    setTimeEstimate(modalVisible.action.timeEstimate);
    setAction(modalVisible.action.action);
  }, [modalVisible.action.action]);

  const reset = () => {
    setAction("");
    setTimeEstimate(0);
    setAreaOfImportance("");
  };

  const createAutoCompleteText = () => {
    return actions.map((action: ActionItemT) => action.action);
  };

  const handleAddTodo = () => {
    if (!action) {
      setAlert("Action is required");
      return;
    }
    if (timeEstimate === 0) {
      setAlert("Time Estimate is required");
      return;
    }

    if (timeEstimate > 9) {
      setAlert("Time estimate cannot be over 9 hours");
      return;
    }

    if (!areaOfImportance || areaOfImportance === "No AOI found, please add from the AOI tab") {
      setAlert("Area of Importance is required");
      return;
    }

    modalVisible.action.action
      ? updateAction(setAlert, setActions, {
          ...modalVisible.action,
          action: action,
          timeEstimate: timeEstimate,
          areaOfImportance: areaOfImportance,
        })
      : addAction(setAlert, setActions, action, timeEstimate, areaOfImportance);
    modalVisible.action.action ? handleClose() : null;

    reset();
  };

  const handleClose = () => {
    reset();
    setModalVisible({
      show: false as boolean,
      action: {
        key: "",
        action: "",
        isCompleted: false,
        timeEstimate: 0,
        priority: 0,
        areaOfImportance: "",
        dateAdded: new Date().toISOString().split("T")[0],
      } as ActionItemT,
    });
  };

  const createOptions = () => {
    if (!areasOfImportance || areasOfImportance.length === 0) {
      return [
        {
          label: "No AOI found, please add from the AOI tab",
          value: "",
        },
      ];
    }

    return areasOfImportance.map((item) => {
      return {
        label: item.AOI,
        value: item.AOI,
      };
    });
  };

  return (
    <Modal visible={modalVisible.show} onRequestClose={() => setModalVisible(false)}>
      <Select
        title={"Area of Importance"}
        options={createOptions()}
        value={areaOfImportance}
        onChange={setAreaOfImportance}
      />
      <TextInputAutoComplete
        title={"Action"}
        onChangeText={setAction}
        value={action}
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
        max={60}
        increment={5}
        markerColor={colors.primary}
        onChange={(values: number[]) => setTimeMinutes(values[0])}
        values={[timeMinutes]}
        showLabel={false}
      />
      {/* <TimePicker title={"Time Estimate"} setTimeEstimate={setTimeEstimate} /> */}
      <View style={styles.buttonContainer}>
        <Button title={modalVisible.action.action ? "Save" : "Add"} onPress={handleAddTodo} />
        <Button title="Close" onPress={handleClose} />
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
