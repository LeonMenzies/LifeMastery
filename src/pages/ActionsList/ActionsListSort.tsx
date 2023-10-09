import "react-native-get-random-values";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";

import { getActions } from "~utils/ActionsHandler";
import { alertAtom } from "~recoil/alertAtom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ActionsListItem } from "~pages/ActionsList/ActionsListItem";
import { themeAtom } from "~recoil/themeAtom";
import { ActionItemT, ThemeT } from "~types/Types";
import { actionsAtom } from "~recoil/actionsAtom";
import { ActionListSortButton } from "~pages/ActionsList/ActionListSortButton";

type ActionsListSortT = {
  actions: ActionItemT[];
  setActions: any;
};

export const ActionsListSort = ({ actions, setActions }: ActionsListSortT) => {
  const setAlert = useSetRecoilState(alertAtom);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);
  const [selected, setSelected] = useState("Date");
  const [desc, setDesc] = useState(false);
  const sortTypes = ["Date", "Time", "AOI"];

  const sortActionList = (sortType: string) => {
    setActions(
      actions.slice().sort((a, b) => {
        let comparison = 0;
        switch (sortType) {
          case "Date":
            comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
            break;
          case "AOI":
            comparison = a.areaOfImportance.localeCompare(b.areaOfImportance);
            break;
          case "Time":
            comparison = a.timeEstimate - b.timeEstimate;
            break;
          default:
            comparison = 0;
        }
        setDesc(selected !== sortType ? true : !desc);
        return desc ? comparison * -1 : comparison;
      })
    );
    setSelected(sortType);
  };

  useEffect(() => {
    setDesc(false);
  }, [selected]);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {sortTypes.map((string: string, index: number) => (
          <ActionListSortButton
            key={string}
            text={string}
            borders={index !== 0}
            selected={string === selected}
            setSelected={sortActionList}
            desc={desc}
          />
        ))}
      </View>
    </View>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
    },
    buttonContainer: {
      borderRadius: 5,
      borderColor: colors.primary,
      borderWidth: 2,
      marginBottom: 30,
      flexDirection: "row",
    },
  });
