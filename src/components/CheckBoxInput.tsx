import { TouchableOpacity, Text, StyleSheet, View, GestureResponderEvent } from "react-native";

type CheckBoxInputT = {
  onPress: (event: GestureResponderEvent) => void;
  completed: boolean;
  color: string;
};

const CheckBoxInput = ({ onPress, color, completed }: CheckBoxInputT) => {
  const styles = styling(color, completed);

  return <TouchableOpacity style={styles.button} onPress={onPress} />;
};

const styling = (color: string, completed: boolean) =>
  StyleSheet.create({
    button: {
      borderRadius: 100,
      backgroundColor: completed ? color : "white",
      borderColor: "grey",
      borderWidth: 1,
      width: 20,
      height: 20,
      margin: 5,
    },
  });

export default CheckBoxInput;
