import "react-native-get-random-values";
import React, { useEffect, FC, useState } from "react";
import { View, StyleSheet, Text } from "react-native";

import { getActions } from "~utils/ActionsHandler";
import { alertAtom } from "~recoil/alertAtom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ActionsListItem } from "~pages/ActionsList/ActionsListItem";
import { themeAtom } from "~recoil/themeAtom";
import { ActionItemT, ThemeT } from "~types/Types";
import { actionsAtom } from "~recoil/actionsAtom";
import { ActionsListSort } from "./ActionsListSort";
import { ActionAddEdit } from "~components/ActionAddEdit";
import { IconButton } from "~components/IconButton";
import { AreasOfImportance } from "~pages/AreasOfImportance/AreasOfImportance";

export const ActionsList: FC<any> = () => {
  const setAlert = useSetRecoilState(alertAtom);
  const [actions, setActions] = useRecoilState(actionsAtom);
  const [showComplete, setShowComplete] = useState(false);
  const [actionModal, setActionModal] = useState<{ show: boolean; newAction: boolean }>({
    show: false,
    newAction: true,
  });
  const [aoiModal, setAoiModal] = useState<boolean>(false);

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
            setActionModal({
              show: true,
              newAction: true,
            })
          }
        />
        <IconButton icon={"options"} color={colors.primary} onPress={() => setAoiModal(true)} />
      </View>
      <ActionsListSort
        actions={actions}
        setActions={setActions}
        showComplete={showComplete}
        setShowComplete={setShowComplete}
      />

      {actions.length > 0 ? (
        actions.map((item: ActionItemT, index: number) => (
          <ActionsListItem item={item} setModalVisible={setActionModal} key={index} />
        ))
      ) : (
        <Text style={{ color: colors.grey, marginTop: 50 }}>No Actions</Text>
      )}

      <ActionAddEdit modalVisible={actionModal} setModalVisible={setActionModal} />
      <AreasOfImportance modalVisible={aoiModal} setModalVisible={setAoiModal} />
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
