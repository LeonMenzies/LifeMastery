import "react-native-get-random-values";
import { useState, FC, useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Keyboard, Animated } from "react-native";
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
  const modalHeight = useRef(new Animated.Value(0)).current;

  const handleAddTodo = () => {
    if (!areaOfImportance) {
      setAlert("Area of Importance is required");
      return;
    }

    addAreaOfImportance(setAlert, setData, areaOfImportance);
    setAreaOfImportance("");
  };

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener("keyboardWillShow", (e) => {
      Animated.timing(modalHeight, {
        toValue: e.endCoordinates.height - 50,
        duration: e.duration,
        useNativeDriver: false,
      }).start();
    });

    const keyboardWillHideListener = Keyboard.addListener("keyboardWillHide", (e) => {
      Animated.timing(modalHeight, {
        toValue: 0,
        duration: e.duration,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  return (
    <Animated.View style={[styles.container, { marginBottom: modalHeight }]}>
      <TextInput title={"Area of Importance"} onChangeText={setAreaOfImportance} value={areaOfImportance} placeholder="Add area of importance..." keyboardType="default" maxLength={30} />
      <View style={styles.buttonContainer}>
        <Button title="Add" onPress={handleAddTodo} />
      </View>
    </Animated.View>
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
