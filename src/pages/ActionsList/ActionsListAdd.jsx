import "react-native-get-random-values";

import React, { useEffect, useState } from "react";
import { SafeAreaView, Button, TouchableOpacity, Text, View } from "react-native";
import styled from "styled-components/native";
import { addAction } from "../../utils/ActionsHandler";
import TextInputComponent from "../../components/TextInput";
import { alertAtom } from "../../recoil/alertAtom";
import { actionsAtom } from "../../recoil/actionsAtom";
import { areasOfImportanceAtom } from "../../recoil/areasOfImportanceAtom";
import { useSetRecoilState, useRecoilState } from "recoil";
import Select from "../../components/Select";
import { getAreasOfImportance } from "../../utils/AreasOfImportanceHandler";

const StyledActionsListAdd = styled.SafeAreaView`
  background-color: white;
`;

const AddActionButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const ActionsListAdd = () => {
  const [text, setText] = useState("test action");
  const [timeEstimate, setTimeEstimate] = useState(20);
  const [priority, setPriority] = useState(1);
  const [areaOfImportance, setAreaOfImportance] = useState("none");

  const setAlert = useSetRecoilState(alertAtom);
  const setActions = useSetRecoilState(actionsAtom);
  const [areasOfImportance, setAreasOfImportance] = useRecoilState(areasOfImportanceAtom);

  console.log(areasOfImportance);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAreasOfImportance(setAlert, setAreasOfImportance, setLoading);
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
      return ["No AOI found, please add from the AOI tab"];
    }

    return areasOfImportance.map((item) => {
      return item.AOI;
    });
  };

  return (
    <StyledActionsListAdd>
      <Select
        title={"Area of Importance"}
        options={createOptions()}
        value={areaOfImportance}
        setValue={setAreaOfImportance}
      />
      <TextInputComponent
        title={"Action"}
        onChangeText={setText}
        value={text}
        placeholder="Add value..."
        keyboardType="default"
        maxLength={30}
      />
      <TextInputComponent
        title={"Time estimate"}
        onChangeText={setTimeEstimate}
        value={timeEstimate}
        placeholder="Add value..."
        keyboardType="numeric"
        maxLength={30}
      />
      <TextInputComponent
        title={"Priority"}
        onChangeText={setPriority}
        value={priority}
        placeholder="Add value..."
        keyboardType="numeric"
        maxLength={30}
      />

      <AddActionButtonContainer>
        <Button title="Add" onPress={handleAddTodo} />
        <Button
          title="Clear"
          onPress={() => {
            setText("");
            setTimeEstimate("");
            setPriority(0);
            setAreaOfImportance("");
          }}
        />
      </AddActionButtonContainer>
    </StyledActionsListAdd>
  );
};

export default ActionsListAdd;
