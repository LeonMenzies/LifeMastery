import { FC } from "react";
import { StyleSheet, TouchableHighlight, Text } from "react-native";
import { useRecoilValue } from "recoil";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

type ButtonT = {
  title: string;
  onPress: any;
  disabled?: boolean;
};

export const Button: FC<ButtonT> = ({ title, onPress, disabled = false }) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(disabled, colors);

  return (
    <TouchableHighlight
      underlayColor={colors.grey}
      style={styles.button}
      onPress={disabled ? undefined : onPress}
    >
      <Text style={styles.title}>{title}</Text>
    </TouchableHighlight>
  );
};

const styling = (disabled: boolean, colors: ThemeT) =>
  StyleSheet.create({
    button: {
      padding: 7,
      margin: 7,
      zIndex: 2,
      backgroundColor: disabled ? colors.lightGrey : colors.primary,
      minWidth: 100,
      alignItems: "center",
    },
    title: {
      fontSize: 15,
    },
  });
