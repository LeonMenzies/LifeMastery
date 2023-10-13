import "react-native-get-random-values";
import React, { useEffect, FC, useState } from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";

import { getActions } from "~utils/ActionsHandler";
import { alertAtom } from "~recoil/alertAtom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ActionsListItem } from "~pages/ActionsList/ActionsListItem";
import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";
import { actionsAtom } from "~recoil/actionsAtom";
import { ActionsListSort } from "./ActionsListSort";

export const ActionsList: FC<any> = () => {
  const setAlert = useSetRecoilState(alertAtom);
  const [actions, setActions] = useRecoilState(actionsAtom);
  const [showComplete, setShowComplete] = useState(false);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  useEffect(() => {
    getActions(setAlert, setActions);
  }, []);

  const renderItem = ({ item, drag, isActive }) => {
    if (!showComplete && item.isCompleted) return; // Hide complete actions
    return <ActionsListItem item={item} drag={drag} isActive={isActive} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ActionsListSort
        actions={actions}
        setActions={setActions}
        showComplete={showComplete}
        setShowComplete={setShowComplete}
      />
      {actions.length > 0 ? (
        <DraggableFlatList
          data={actions}
          onDragEnd={({ data }) => setActions(data)}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
        />
      ) : (
        <Text>No Actions in your list</Text>
      )}
    </SafeAreaView>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      height: "100%",
      alignItems: "center",
    },
  });
