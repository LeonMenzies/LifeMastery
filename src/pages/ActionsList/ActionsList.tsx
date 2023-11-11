import "react-native-get-random-values";
import React, { useEffect, FC, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { View, StyleSheet, Text, Dimensions, ScrollView } from "react-native";

import { deleteActions, getActions } from "~utils/ActionsHandler";
import { alertAtom } from "~recoil/alertAtom";
import { ActionsListItem } from "~pages/ActionsList/ActionsListItem";
import { themeAtom } from "~recoil/themeAtom";
import { ActionItemT, ThemeT } from "~types/Types";
import { actionsAtom } from "~recoil/actionsAtom";
import { ActionsListSort } from "./ActionsListSort";
import { ActionAddEdit } from "~components/ActionAddEdit";
import { IconButton } from "~components/IconButton";
import { AreasOfImportance } from "~pages/AreasOfImportance/AreasOfImportance";
import { Button } from "~components/Button";

export const ActionsList: FC<any> = () => {
  const setAlert = useSetRecoilState(alertAtom);
  const [actions, setActions] = useRecoilState(actionsAtom);
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
    selected: "Time",
    desc: true,
  });

  const colors = useRecoilValue(themeAtom);
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
        selected={selected}
        setSelected={setSelected}
        showComplete={showComplete}
        setShowComplete={setShowComplete}
      />
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
      justifyContent: "space-between",
      height: "80%",
    },
  });
