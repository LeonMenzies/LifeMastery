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

export const AreasOfImportance: FC<any> = () => {
  const [data, setData] = useRecoilState(areasOfImportanceAtom);
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
    <View style={styles.container}>
      <View>
        <AreasOfImportanceAdd />

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
              deleteAreaOfImportance(setAlert, setData, deleteItems);
              setDeleteItem(false);
            }}
            disabled={deleteItems.length < 1}
          />
        </View>
      )}
    </View>
  );
};

const styling = (colors: ThemeT, windowWidth: number) =>
  StyleSheet.create({
    container: {
      justifyContent: "space-between",
      alignItems: "center",
      flex: 1,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "center",
      width: windowWidth - 50,
    },
  });
