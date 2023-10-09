import "react-native-get-random-values";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";

import { Select } from "~components/Select";
import { getAreasOfImportance } from "~utils/AreasOfImportanceHandler";
import { addAction } from "~utils/ActionsHandler";
import { TextInput } from "~components/TextInput";
import { alertAtom } from "~recoil/alertAtom";
import { actionsAtom } from "~recoil/actionsAtom";
import { areasOfImportanceAtom } from "~recoil/areasOfImportanceAtom";
import { Button } from "~components/Button";
import { ThemeT, ActionItemT } from "~types/Types";
import { themeAtom } from "~recoil/themeAtom";

type ActionAddEditT = {
  modalVisible: {
    show: boolean;
    action: ActionItemT;
  };
  setModalVisible: any;
};

export const ActionAddEdit = ({ modalVisible, setModalVisible }: ActionAddEditT) => {
  const setAlert = useSetRecoilState(alertAtom);
  const setActions = useSetRecoilState(actionsAtom);
  const [areasOfImportance, setAreasOfImportance] = useRecoilState(areasOfImportanceAtom);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  const [action, setAction] = useState("");
  const [timeEstimate, setTimeEstimate] = useState(0);
  const [areaOfImportance, setAreaOfImportance] = useState("");

  useEffect(() => {
    getAreasOfImportance(setAlert, setAreasOfImportance);
  }, [modalVisible.action.action]);

  useEffect(() => {
    setAreaOfImportance(modalVisible.action.areaOfImportance);
    setTimeEstimate(modalVisible.action.timeEstimate);
    setAction(modalVisible.action.action);
  }, [modalVisible.action.action]);

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

    addAction(setAlert, setActions, action, timeEstimate, areaOfImportance);
    setAction("");
    setTimeEstimate(0);
    setAreaOfImportance("");
  };

  const handleClose = () => {
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
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible.show}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Select
            title={"Area of Importance"}
            options={createOptions()}
            value={areaOfImportance}
            onChange={setAreaOfImportance}
          />
          <TextInput
            title={"Action"}
            onChangeText={setAction}
            value={action}
            placeholder="Add value..."
            keyboardType="default"
            maxLength={30}
          />
          <TextInput
            title={"Time estimate"}
            onChangeText={setTimeEstimate}
            value={timeEstimate.toString()}
            placeholder="Add value..."
            keyboardType="numeric"
            maxLength={30}
          />
          <View style={styles.buttonContainer}>
            <Button title="Add" onPress={handleAddTodo} />
            <Button title="Close" onPress={handleClose} />
          </View>
        </View>
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
      backgroundColor: colors.white,
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
