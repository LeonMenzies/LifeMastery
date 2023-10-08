import { FC } from "react";
import { Text, StyleSheet, View, TouchableHighlight } from "react-native";
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
      <TouchableHighlight
        style={styles.button}
        onPress={() => {
          if (value > 1) {
            onChange(value - 1);
          }
        }}
      >
        <Text>{"-"}</Text>
      </TouchableHighlight>
      <Text style={styles.value}>{value}</Text>
      <TouchableHighlight
        style={styles.button}
        onPress={() => {
          if (value < maxValue) {
            onChange(value + 1);
          }
        }}
      >
        <Text>{"+"}</Text>
      </TouchableHighlight>
    </View>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      padding: 7,
      zIndex: 2,
      flexDirection: "row",
    },
    value: {
      fontSize: 15,
      color: colors.grey,
      padding: 10,
    },
    button: {
      fontSize: 17,
      padding: 10,
      backgroundColor: colors.lightGrey,
    },
  });
