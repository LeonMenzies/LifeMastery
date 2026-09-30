import "react-native-get-random-values";
import React, { useEffect, FC, useState } from "react";
import { View, StyleSheet, Text, Dimensions, ScrollView } from "react-native";

import { deleteActions, getActions } from "~utils/ActionsHandler";
import { useAlertStore } from "~store/alertStore";
import { ActionsListItem } from "~pages/ActionsList/ActionsListItem";
import { useThemeStore } from "~store/themeStore";
import { ActionItemT, ThemeT } from "~types/Types";
import { useActionsStore } from "~store/actionsStore";
import { ActionsListSort } from "./ActionsListSort";
import { ActionAddEdit } from "~components/ActionAddEdit";
import { IconButton } from "~components/IconButton";
import { AreasOfImportance } from "~pages/AreasOfImportance/AreasOfImportance";
import { Button } from "~components/Button";

export const ActionsList: FC<any> = () => {
  const setAlert = useAlertStore((s) => s.setAlert);
  const actions = useActionsStore((s) => s.actions);
  const setActions = useActionsStore((s) => s.setActions);
  const [actionModal, setActionModal] = useState<{ show: boolean; newAction: boolean }>({
    show: false,
    newAction: true,
  });
  const [aoiModal, setAoiModal] = useState<boolean>(false);
  const [deleteItem, setDeleteItem] = useState(false);
  const [deleteItems, setDeleteItems] = useState<string[]>([]);
  const windowWidth = Dimensions.get("window").width;
  const [showComplete, setShowComplete] = useState(false);
  const [selected, setSelected] = useState({
    selected: "Date",
    desc: true,
  });

  const colors = useThemeStore((s) => s.theme);
  const styles = styling(colors, windowWidth);

  useEffect(() => {
    getActions(setAlert, setActions);
  }, []);

  const filterActions = () => {
    return actions
      .filter((action: ActionItemT) => (showComplete ? true : !action.isCompleted))
      .sort((a: ActionItemT, b: ActionItemT) => {
        let comparison = 0;
        switch (selected.selected) {
          case "Date":
            comparison = new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
            break;
          case "AOI":
            comparison = b.areaOfImportance.localeCompare(a.areaOfImportance);
            break;
          case "Time":
            comparison = a.timeEstimate - b.timeEstimate;
            break;
          default:
            comparison = 0;
        }
        return selected.desc ? comparison * -1 : comparison;
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.addContainer}>
        <IconButton
          icon={"plus"}
          color={colors.accent}
          onPress={() =>
            setActionModal({
              show: true,
              newAction: true,
            })
          }
        />
        <IconButton icon={"options"} color={colors.accent} onPress={() => setAoiModal(true)} />
      </View>
      <ActionsListSort selected={selected} setSelected={setSelected} showComplete={showComplete} setShowComplete={setShowComplete} />
      <View style={styles.actionsContainer}>
        <ScrollView>
          {actions.length > 0 ? (
            filterActions().map((item: ActionItemT, index: number) => (
              <ActionsListItem
                item={item}
                setModalVisible={setActionModal}
                key={index}
                deleteItem={deleteItem}
                setDeleteItem={setDeleteItem}
                deleteItems={deleteItems}
                setDeleteItems={setDeleteItems}
              />
            ))
          ) : (
            <Text style={{ color: colors.grey, marginTop: 50 }}>No Actions</Text>
          )}
        </ScrollView>
        {deleteItem && (
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={() => {
                setDeleteItem(false);
                setDeleteItems([]);
              }}
            />
            <Button
              title="Delete"
              onPress={() => {
                deleteActions(setAlert, setActions, deleteItems);
                setDeleteItem(false);
              }}
              disabled={deleteItems.length < 1}
            />
          </View>
        )}
      </View>
      <ActionAddEdit modalVisible={actionModal} setModalVisible={setActionModal} />
      <AreasOfImportance modalVisible={aoiModal} setModalVisible={setAoiModal} />
    </View>
  );
};

const styling = (colors: ThemeT, windowWidth: number) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      height: "100%",
    },
    addContainer: {
      width: "100%",
      paddingHorizontal: 10,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "center",
      width: windowWidth - 50,
    },
    actionsContainer: {
      flex: 1,
    },
  });
