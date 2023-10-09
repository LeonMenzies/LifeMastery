import { TouchableOpacity, StyleSheet, GestureResponderEvent } from "react-native";
import { useRecoilValue } from "recoil";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

type CheckBoxInputT = {
  onPress: (event: GestureResponderEvent) => void;
  completed: boolean;
  color: string;
  disabled: boolean;
};

export const CheckBoxInput = ({ onPress, color, completed, disabled }: CheckBoxInputT) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(color, completed, colors);
  return <TouchableOpacity style={styles.button} onPress={disabled ? null : onPress} />;
};

const styling = (color: string, completed: boolean, colors: ThemeT) =>
  StyleSheet.create({
    button: {
      borderRadius: 100,
      backgroundColor: completed ? color : colors.white,
      borderColor: "grey",
      borderWidth: 1,
      width: 20,
      height: 20,
      margin: 5,
    },
  });
