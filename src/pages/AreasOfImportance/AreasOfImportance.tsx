import "react-native-get-random-values";
import { useEffect, FC, useState } from "react";
import { Text, Dimensions, StyleSheet, View } from "react-native";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";

import { AreasOfImportanceItem } from "~pages/AreasOfImportance/AreasOfImportanceItem";
import { deleteAreaOfImportance, getAreasOfImportance } from "~utils/AreasOfImportanceHandler";
import { AreasOfImportanceAdd } from "~pages/AreasOfImportance/AreasOfImportanceAdd";
import { alertAtom } from "~recoil/alertAtom";
import { areasOfImportanceAtom } from "~recoil/areasOfImportanceAtom";
import { themeAtom } from "~recoil/themeAtom";
import { AreaOfImportanceItemT, ThemeT } from "~types/Types";
import { Button } from "~components/Button";
import { Modal } from "~components/Modal";
import { actionsAtom } from "~recoil/actionsAtom";

type AreasOfImportanceT = {
  modalVisible: boolean;
  setModalVisible: Function;
};

export const AreasOfImportance: FC<AreasOfImportanceT> = ({ modalVisible, setModalVisible }) => {
  const [data, setData] = useRecoilState(areasOfImportanceAtom);
  const setActions = useSetRecoilState(actionsAtom);

  const [deleteItem, setDeleteItem] = useState(false);
  const [deleteItems, setDeleteItems] = useState<string[]>([]);

  const windowWidth = Dimensions.get("window").width;

  const setAlert = useSetRecoilState(alertAtom);
  const colors = useRecoilValue(themeAtom);
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
              <AreasOfImportanceItem
                key={index}
                item={item}
                deleteItem={deleteItem}
                setDeleteItem={setDeleteItem}
                deleteItems={deleteItems}
                setDeleteItems={setDeleteItems}
              />
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
    },
  });
