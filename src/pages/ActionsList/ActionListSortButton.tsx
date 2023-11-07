import React, { FC } from "react";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRecoilValue } from "recoil";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

type SortButtonT = {
  text: string;
  borders: boolean;
  selected: boolean;
  desc: boolean;
  setSelected: ({ selected, desc }: any) => void;
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
    return desc ? <Icon name="arrow-down" /> : <Icon name="arrow-up" />;
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() =>
        setSelected({
          selected: text,
          desc: !desc,
        })
      }
    >
      <View style={styles.container}>
        <Text style={styles.text}>{text}</Text>
        <Carrot />
      </View>
    </TouchableOpacity>
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
