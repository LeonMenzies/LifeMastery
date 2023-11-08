import "react-native-get-random-values";
import { useState, FC } from "react";
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Dimensions } from "react-native";
import { useSetRecoilState } from "recoil";

import { addAreaOfImportance } from "~utils/AreasOfImportanceHandler";
import { TextInput } from "~components/TextInput";
import { alertAtom } from "~recoil/alertAtom";
import { areasOfImportanceAtom } from "~recoil/areasOfImportanceAtom";
import { Button } from "~components/Button";

export const AreasOfImportanceAdd: FC<any> = () => {
  const [areaOfImportance, setAreaOfImportance] = useState("");
  const windowWidth = Dimensions.get("window").width;
  const styles = styling(windowWidth);
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
    <KeyboardAvoidingView style={styles.container}>
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
    </KeyboardAvoidingView>
  );
};

const styling = (windowWidth: number) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      width: windowWidth - 50,
    },
    buttonContainer: {
      padding: 10,
      flexDirection: "row",
    },
  });
