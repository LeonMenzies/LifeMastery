import "react-native-get-random-values";
import React, { FC, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import { useRecoilValue } from "recoil";
import { themeAtom } from "~recoil/themeAtom";
import { ActionItemT, ThemeT } from "~types/Types";
import { ActionListSortButton } from "~pages/ActionsList/ActionListSortButton";
import { ActionListCompleteButton } from "~pages/ActionsList/ActionListCompleteButton";

type ActionsListSortT = {
  selected: {
    selected: string;
    desc: boolean;
  };
  setSelected: ({ selected, desc }: any) => void;
  showComplete: boolean;
  setShowComplete: (b: boolean) => void;
};

export const ActionsListSort: FC<ActionsListSortT> = ({
  selected,
  showComplete,
  setShowComplete,
  setSelected,
}) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);
  const sortTypes = ["Date", "Time", "AOI"];

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {sortTypes.map((string: string, index: number) => (
          <ActionListSortButton
            key={string}
            text={string}
            borders={index !== 0}
            selected={string === selected.selected}
            setSelected={setSelected}
            desc={selected.desc}
          />
        ))}
        <ActionListCompleteButton
          text={"Complete"}
          borders={true}
          selected={showComplete}
          onPress={() => setShowComplete(!showComplete)}
        />
      </View>
    </View>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      margin: 10,
    },
    buttonContainer: {
      borderRadius: 5,
      borderColor: colors.primary,
      borderWidth: 2,
      marginBottom: 10,
      flexDirection: "row",
    },
  });
