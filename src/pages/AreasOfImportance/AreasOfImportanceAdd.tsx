import "react-native-get-random-values";
import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import { useSetRecoilState } from "recoil";

import { addAreaOfImportance } from "~utils/AreasOfImportanceHandler";
import { TextInput } from "~components/TextInput";
import { alertAtom } from "~recoil/alertAtom";
import { areasOfImportanceAtom } from "~recoil/areasOfImportanceAtom";
import { Button } from "~components/Button";

export const AreasOfImportanceAdd = ({}) => {
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
    <SafeAreaView>
      <TextInput
        title={"Area of Importance"}
        onChangeText={setAreaOfImportance}
        value={areaOfImportance}
        placeholder="Add area of importance..."
        keyboardType="default"
        maxLength={30}
      />
      <Button title="Add" onPress={handleAddTodo} />
    </SafeAreaView>
  );
};
