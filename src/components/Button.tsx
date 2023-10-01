import { FC } from "react";
import { StyleSheet, TouchableHighlight, Text } from "react-native";
import { colors } from "~styles/GlobalStyles";

type ButtonT = {
  title: string;
  onPress: any;
};

export const Button: FC<ButtonT> = ({ title, onPress }) => {
  return (
    <TouchableHighlight underlayColor={colors.darkGrey} style={styles.button} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 7,
    margin: 7,
    zIndex: 2,
    backgroundColor: colors.mediumGrey,
    minWidth: 100,
    alignItems: "center",
  },
  title: {
    fontSize: 15,
  },
});
