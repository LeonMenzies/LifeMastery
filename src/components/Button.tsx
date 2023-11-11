import { FC } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
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
    <TouchableOpacity
      style={styles.button}
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.4}
    >
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styling = (disabled: boolean, colors: ThemeT) =>
  StyleSheet.create({
    button: {
      padding: 10,
      margin: 7,
      zIndex: 2,
      minWidth: 100,
      alignItems: "center",
      borderRadius: 14,
      borderWidth: 2,
      borderColor: disabled ? colors.grey : colors.primary,
    },
    title: {
      fontSize: 15,
      color: disabled ? colors.grey : colors.textPrimary,
    },
  });
