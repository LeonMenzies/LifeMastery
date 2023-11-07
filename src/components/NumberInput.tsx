import { FC } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { useRecoilValue } from "recoil";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

type NumberInputT = {
  value: number;
  onChange: any;
  maxValue: number;
};

export const NumberInput: FC<NumberInputT> = ({ onChange, value, maxValue }) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (value > 1) {
            onChange(value - 1);
          }
        }}
      >
        <Text style={styles.text}>{"-"}</Text>
      </TouchableOpacity>
      <Text style={styles.value}>{value}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (value < maxValue) {
            onChange(value + 1);
          }
        }}
      >
        <Text style={styles.text}>{"+"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      margin: 8,
      padding: 4,
      zIndex: 2,
      flexDirection: "row",
    },
    value: {
      fontSize: 22,
      color: colors.textPrimary,
      paddingHorizontal: 38,
      paddingVertical: 10,
    },
    button: {
      justifyContent: "center",
    },
    text: {
      fontSize: 30,
      color: colors.textPrimary,
    },
  });
