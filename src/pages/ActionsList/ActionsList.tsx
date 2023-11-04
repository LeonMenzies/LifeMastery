import "react-native-get-random-values";
import React, { useEffect, FC, useState } from "react";
import { View, StyleSheet } from "react-native";

import { getActions } from "~utils/ActionsHandler";
import { alertAtom } from "~recoil/alertAtom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ActionsListItem } from "~pages/ActionsList/ActionsListItem";
import { themeAtom } from "~recoil/themeAtom";
import { ActionItemT, ThemeT } from "~types/Types";
import { actionsAtom } from "~recoil/actionsAtom";
import { ActionsListSort } from "./ActionsListSort";
import { NavigatorItem } from "~components/navigator/NavigatorItem";
import { ActionAddEdit } from "~components/ActionAddEdit";
import { createActionAtom, emptyAction } from "~recoil/createActionAtom";

export const ActionsList: FC<any> = () => {
  const setAlert = useSetRecoilState(alertAtom);
  const [actions, setActions] = useRecoilState(actionsAtom);
  const setAction = useSetRecoilState(createActionAtom);
  const [showComplete, setShowComplete] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  useEffect(() => {
    getActions(setAlert, setActions);
  }, []);

  return (
    <NavigatorItem
      rightButton={() => {
        setModalVisible(true);
        setAction(emptyAction);
      }}
      rightButtonIcon={"plus"}
      title={"Actions"}
    >
      <View style={styles.container}>
        <ActionsListSort
          actions={actions}
          setActions={setActions}
          showComplete={showComplete}
          setShowComplete={setShowComplete}
        />
        {actions.map((item: ActionItemT, index: number) => (
          <ActionsListItem item={item} setModalVisible={setModalVisible} key={index} />
        ))}
      </View>
      <ActionAddEdit modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </NavigatorItem>
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
