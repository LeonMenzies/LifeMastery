import "react-native-get-random-values";

import React, { useEffect, useState } from "react";
import { SafeAreaView, Button, TouchableOpacity, Text } from "react-native";
import styled from "styled-components/native";
import { addAction } from "../../utils/ActionsHandler";
import TextInputComponent from "../../components/TextInputComponent";
import { alertAtom } from "../../recoil/alertAtom";
import { actionsAtom } from "../../recoil/actionsAtom";
import { useSetRecoilState } from "recoil";

const StyledActionsListAdd = styled.SafeAreaView`
  background-color: white;
`;

const ActionsListAdd = ({}) => {
  const [text, setText] = useState("test action");
  const [timeEstimate, setTimeEstimate] = useState("20");
  const [areaOfImportance, setAreaOfImportance] = useState("none");

  const setAlert = useSetRecoilState(alertAtom);
  const setActions = useSetRecoilState(actionsAtom);

  const handleAddTodo = () => {
    if (!text) {
      setAlert("Action is required");
      return;
    }
    if (!timeEstimate) {
      setAlert("Time Estimate is required");
      return;
    }
    if (!areaOfImportance) {
      setAlert("Area of Importance is required");
      return;
    }

    addAction(setAlert, setActions, text, timeEstimate, areaOfImportance);
    setText("");
    setTimeEstimate("");
    setAreaOfImportance("");
  };

  return (
    <StyledActionsListAdd>
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
        keyboardType="default"
        maxLength={30}
      />
      <TextInputComponent
        title={"Area of Importance"}
        onChangeText={setAreaOfImportance}
        value={areaOfImportance}
        placeholder="Add value..."
        keyboardType="default"
        maxLength={30}
      />
      <Button title="Add" onPress={handleAddTodo} />
    </StyledActionsListAdd>
  );
};

export default ActionsListAdd;
