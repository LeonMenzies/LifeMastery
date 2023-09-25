import "react-native-get-random-values";

import React, { useEffect, useState } from "react";
import { SafeAreaView, Button, TouchableOpacity, Text, View } from "react-native";
import styled from "styled-components/native";
import { addAreaOfImportance } from "../../utils/AreasOfImportanceHandler";
import TextInputComponent from "../../components/TextInput";
import { alertAtom } from "../../recoil/alertAtom";
import { areasOfImportanceAtom } from "../../recoil/areasOfImportanceAtom";
import { useSetRecoilState } from "recoil";

const StyledAreasOfImportanceAdd = styled.SafeAreaView`
  background-color: white;
  margin: 10px;
`;

const AddAreasOfImportanceButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const AreasOfImportanceAdd = ({}) => {
  const [areaOfImportance, setAreaOfImportance] = useState("");

  const setAlert = useSetRecoilState(alertAtom);
  const setData = useSetRecoilState(areasOfImportanceAtom);

  const handleAddTodo = () => {
    if (!areaOfImportance) {
      setAlert("Area of Importance is required");
      return;
    }

    addAreaOfImportance(setAlert, setData, areaOfImportance);
    setAreaOfImportance("");
  };

  return (
    <StyledAreasOfImportanceAdd>
      <TextInputComponent
        title={"Area of Importance"}
        onChangeText={setAreaOfImportance}
        value={areaOfImportance}
        placeholder="Add value..."
        keyboardType="default"
        maxLength={30}
      />
      <AddAreasOfImportanceButtonContainer>
        <Button title="Add" onPress={handleAddTodo} />
        <Button
          title="Clear"
          onPress={() => {
            setAreaOfImportance("");
          }}
        />
      </AddAreasOfImportanceButtonContainer>
    </StyledAreasOfImportanceAdd>
  );
};

export default AreasOfImportanceAdd;
