import "react-native-get-random-values";
import { useState, FC } from "react";
import { View, StyleSheet } from "react-native";
import { useSetRecoilState } from "recoil";

import { addAreaOfImportance } from "~utils/AreasOfImportanceHandler";
import { TextInput } from "~components/TextInput";
import { alertAtom } from "~recoil/alertAtom";
import { areasOfImportanceAtom } from "~recoil/areasOfImportanceAtom";
import { Button } from "~components/Button";

export const AreasOfImportanceAdd: FC<any> = () => {
  const [areaOfImportance, setAreaOfImportance] = useState("");
  const styles = styling();
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
    <View style={styles.container}>
      <TextInput
        title={"Area of Importance"}
        onChangeText={setAreaOfImportance}
        value={areaOfImportance}
        placeholder="Add area of importance..."
        keyboardType="default"
        maxLength={30}
      />
      <View style={styles.buttonContainer}>
        <Button title="Add" onPress={handleAddTodo} />
      </View>
    </View>
  );
};

const styling = () =>
  StyleSheet.create({
    container: {
      alignItems: "center",
    },
    buttonContainer: {
      padding: 10,
      flexDirection: "row",
    },
  });
