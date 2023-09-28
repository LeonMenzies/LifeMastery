import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, View, Button } from "react-native";
import "react-native-get-random-values";
import { addAction } from "../utils/ActionsHandler";
import TextInput from "./TextInput";
import { alertAtom } from "../recoil/alertAtom";
import { actionsAtom } from "../recoil/actionsAtom";
import { areasOfImportanceAtom } from "../recoil/areasOfImportanceAtom";
import { useSetRecoilState, useRecoilState } from "recoil";
import Select from "../components/Select";
import { getAreasOfImportance } from "../utils/AreasOfImportanceHandler";

type ActionAddEditT = {
  modalVisible: any;
  setModalVisible: any;
};

const ActionAddEdit = ({ modalVisible, setModalVisible }: ActionAddEditT) => {
  const [text, setText] = useState("test action");
  const [timeEstimate, setTimeEstimate] = useState(20);
  const [priority, setPriority] = useState(1);
  const [areaOfImportance, setAreaOfImportance] = useState("");

  const setAlert = useSetRecoilState(alertAtom);
  const setActions = useSetRecoilState(actionsAtom);
  const [areasOfImportance, setAreasOfImportance] = useRecoilState(areasOfImportanceAtom);

  useEffect(() => {
    getAreasOfImportance(setAlert, setAreasOfImportance);
  }, []);

  const handleAddTodo = () => {
    if (!text) {
      setAlert("Action is required");
      return;
    }
    if (timeEstimate === 0) {
      setAlert("Time Estimate is required");
      return;
    }
    if (priority === 0) {
      setAlert("Priority is required");
      return;
    }
    if (!areaOfImportance || areaOfImportance === "No AOI found, please add from the AOI tab") {
      setAlert("Area of Importance is required");
      return;
    }

    addAction(setAlert, setActions, text, timeEstimate, priority, areaOfImportance);
    setText("");
    setTimeEstimate(0);
    setPriority(0);
    setAreaOfImportance("");
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
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
          <Select
            title={"Area of Importance"}
            options={createOptions()}
            value={areaOfImportance}
            onChange={setAreaOfImportance}
          />
          <TextInput
            title={"Action"}
            onChangeText={setText}
            value={text}
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
          <TextInput
            title={"Priority"}
            onChangeText={setPriority}
            value={priority.toString()}
            placeholder="Add value..."
            keyboardType="numeric"
            maxLength={30}
          />
          <View>
            <Button title="Add" onPress={handleAddTodo} />
            <Button
              title="Clear"
              onPress={() => {
                setText("");
                setTimeEstimate(0);
                setPriority(0);
                setAreaOfImportance("");
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
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
});

export default ActionAddEdit;
