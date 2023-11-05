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
import { ActionAddEdit } from "~components/ActionAddEdit";
import { createActionAtom, emptyAction } from "~recoil/createActionAtom";
import { IconButton } from "~components/IconButton";

export const ActionsList: FC<any> = () => {
  const setAlert = useSetRecoilState(alertAtom);
  const [actions, setActions] = useRecoilState(actionsAtom);
  const setAction = useSetRecoilState(createActionAtom);
  const [showComplete, setShowComplete] = useState(false);
  const [modalVisible, setModalVisible] = useState<{ show: boolean; newAction: boolean }>({
    show: false,
    newAction: true,
  });

  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  useEffect(() => {
    getActions(setAlert, setActions);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.addContainer}>
        <IconButton
          icon={"plus"}
          color={colors.primary}
          onPress={() =>
            setModalVisible({
              show: true,
              newAction: true,
            })
          }
        />
        <IconButton
          icon={"question"}
          color={colors.primary}
          onPress={() =>
            setModalVisible({
              show: true,
              newAction: true,
            })
          }
        />
      </View>
      <ActionsListSort
        actions={actions}
        setActions={setActions}
        showComplete={showComplete}
        setShowComplete={setShowComplete}
      />
      {actions.map((item: ActionItemT, index: number) => (
        <ActionsListItem item={item} setModalVisible={setModalVisible} key={index} />
      ))}

      <ActionAddEdit
        modalVisible={modalVisible.show}
        setModalVisible={setModalVisible}
        newAction={modalVisible.newAction}
      />
    </View>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
    },
    addContainer: {
      marginTop: 50,
      width: "100%",
      paddingHorizontal: 10,
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });
