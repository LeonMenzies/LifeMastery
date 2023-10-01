import { TouchableOpacity, StyleSheet, GestureResponderEvent } from "react-native";

import { colors } from "~styles/GlobalStyles";

type CheckBoxInputT = {
  onPress: (event: GestureResponderEvent) => void;
  completed: boolean;
  color: string;
};

export const CheckBoxInput = ({ onPress, color, completed }: CheckBoxInputT) => {
  const styles = styling(color, completed);

  return <TouchableOpacity style={styles.button} onPress={onPress} />;
};

const styling = (color: string, completed: boolean) =>
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
