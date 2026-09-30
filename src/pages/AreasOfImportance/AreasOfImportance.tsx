import "react-native-get-random-values";
import { useEffect, FC, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

import { AreasOfImportanceItem } from "~pages/AreasOfImportance/AreasOfImportanceItem";
import { deleteAreaOfImportance, getAreasOfImportance } from "~utils/AreasOfImportanceHandler";
import { AreasOfImportanceAdd } from "~pages/AreasOfImportance/AreasOfImportanceAdd";
import { useAlertStore } from "~store/alertStore";
import { useAreasOfImportanceStore } from "~store/areasOfImportanceStore";
import { useThemeStore } from "~store/themeStore";
import { AreaOfImportanceItemT, ThemeT } from "~types/Types";
import { Button } from "~components/Button";
import { Modal } from "~components/Modal";
import { useActionsStore } from "~store/actionsStore";

type AreasOfImportanceT = {
  modalVisible: boolean;
  setModalVisible: Function;
};

export const AreasOfImportance: FC<AreasOfImportanceT> = ({ modalVisible, setModalVisible }) => {
  const data = useAreasOfImportanceStore((s) => s.areasOfImportance);
  const setData = useAreasOfImportanceStore((s) => s.setAreasOfImportance);
  const setActions = useActionsStore((s) => s.setActions);

  const [deleteItem, setDeleteItem] = useState(false);
  const [deleteItems, setDeleteItems] = useState<string[]>([]);

  const windowWidth = Dimensions.get("window").width;

  const setAlert = useAlertStore((s) => s.setAlert);
  const colors = useThemeStore((s) => s.theme);
  const styles = styling(colors, windowWidth);

  useEffect(() => {
    getAreasOfImportance(setAlert, setData);
  }, []);

  return (
    <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
      <View style={styles.container}>
        <View>
          <View>
            {data.map((item: AreaOfImportanceItemT, index: number) => (
              <AreasOfImportanceItem key={index} item={item} deleteItem={deleteItem} setDeleteItem={setDeleteItem} deleteItems={deleteItems} setDeleteItems={setDeleteItems} />
            ))}
          </View>
        </View>
        {deleteItem ? (
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
                deleteAreaOfImportance(setAlert, setData, setActions, deleteItems);
                setDeleteItem(false);
              }}
              disabled={deleteItems.length < 1}
            />
          </View>
        ) : (
          <AreasOfImportanceAdd />
        )}
      </View>
    </Modal>
  );
};

const styling = (colors: ThemeT, windowWidth: number) =>
  StyleSheet.create({
    container: {},
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "center",
      width: windowWidth - 50,
      padding: 10,
    },
  });
