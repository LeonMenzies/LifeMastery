import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { useRecoilValue } from "recoil";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

type SortButtonT = {
  text: string;
  borders: boolean;
  selected: boolean;
  setSelected: (sortType: string) => void;
};

export const ActionListSortButton = ({ text, borders, selected, setSelected }: SortButtonT) => {
  const colors = useRecoilValue(themeAtom);

  const styles = styling(colors, selected, borders);
  return (
    <TouchableHighlight
      underlayColor={colors.grey}
      style={styles.button}
      onPress={() => setSelected(text)}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableHighlight>
  );
};

const styling = (colors: ThemeT, selected: boolean, border: boolean) =>
  StyleSheet.create({
    button: {
      padding: 5,
      width: "20%",
      alignItems: "center",
      backgroundColor: selected ? colors.primary : null,
      borderLeftColor: border ? colors.primary : null,
      borderLeftWidth: border ? 2 : null,
    },
    text: {
      fontSize: 17,
    },
    title: {
      fontSize: 22,
    },
  });
