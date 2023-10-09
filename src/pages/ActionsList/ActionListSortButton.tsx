import React, { FC } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { useRecoilValue } from "recoil";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

type SortButtonT = {
  text: string;
  borders: boolean;
  selected: boolean;
  desc: boolean;
  setSelected: (sortType: string) => void;
};

export const ActionListSortButton: FC<SortButtonT> = ({
  text,
  borders,
  selected,
  setSelected,
  desc,
}) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors, selected, borders);

  const Carrot = ({}) => {
    if (!selected) {
      return <></>;
    }
    return desc ? <Icon name="caretup" /> : <Icon name="caretdown" />;
  };

  return (
    <TouchableHighlight
      underlayColor={colors.grey}
      style={styles.button}
      onPress={() => setSelected(text)}
    >
      <View style={styles.container}>
        <Text style={styles.text}>{text}</Text>
        <Carrot />
      </View>
    </TouchableHighlight>
  );
};

const styling = (colors: ThemeT, selected: boolean, border: boolean) =>
  StyleSheet.create({
    button: {
      padding: 5,
      width: "25%",
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
    },
    title: {
      fontSize: 22,
    },
  });
