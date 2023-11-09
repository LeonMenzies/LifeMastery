import React, { FC } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { useRecoilValue } from "recoil";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

type SortButtonT = {
  text: string;
  borders: boolean;
  selected: boolean;
  onPress: () => void;
};

export const ActionListCompleteButton: FC<SortButtonT> = ({ text, borders, selected, onPress }) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors, selected, borders);

  return (
    <TouchableHighlight underlayColor={colors.grey} style={styles.button} onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableHighlight>
  );
};

const styling = (colors: ThemeT, selected: boolean, border: boolean) =>
  StyleSheet.create({
    button: {
      padding: 5,
      width: "22%",
      alignItems: "center",
      backgroundColor: selected ? colors.primary : null,
      borderLeftColor: border ? colors.primary : null,
      borderLeftWidth: border ? 2 : null,
    },
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    text: {
      fontSize: 17,
      color: selected ? colors.textSecondary : colors.textPrimary,
    },
  });
