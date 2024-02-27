import { FC } from "react";
import { TouchableOpacity, Text, View, StyleSheet, Dimensions } from "react-native";
import { useRecoilValue } from "recoil";

import { AreaOfImportanceItemT, ThemeT } from "~types/Types";
import { themeAtom } from "~recoil/themeAtom";
import { CheckBoxInput } from "~components/CheckBoxInput";

type AreasOfImportanceItemT = {
  item: AreaOfImportanceItemT;
  deleteItem: boolean;
  setDeleteItem: Function;
  deleteItems: string[];
  setDeleteItems: Function;
};

export const AreasOfImportanceItem: FC<AreasOfImportanceItemT> = ({ item, deleteItem, setDeleteItem, deleteItems, setDeleteItems }) => {
  const colors = useRecoilValue(themeAtom);
  const windowWidth = Dimensions.get("window").width;
  const styles = styling(item.Color, colors, windowWidth);

  function toggleItemInArray() {
    if (deleteItem) setDeleteItems(deleteItems.includes(item.key) ? deleteItems.filter((val) => val !== item.key) : [...deleteItems, item.key]);
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      onLongPress={() => {
        setDeleteItem(true);
        setDeleteItems([item.key]);
      }}
    >
      <View style={styles.container}>
        <Text style={styles.aoiText}>{item.AOI}</Text>
        {deleteItem ? <CheckBoxInput onPress={toggleItemInArray} completed={deleteItems.includes(item.key)} color={colors.error} disabled={false} /> : <View style={styles.aoiColor} />}
      </View>
    </TouchableOpacity>
  );
};

const styling = (color: string, colors: ThemeT, windowWidth: number) =>
  StyleSheet.create({
    container: {
      width: windowWidth - 50,
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: colors.background,
      height: 40,
    },
    aoiColor: {
      borderRadius: 100,
      backgroundColor: color,
      borderColor: color,
      borderWidth: 1,
      width: 24,
      height: 24,
      margin: 8,
    },
    aoiText: {
      fontSize: 20,
      color: colors.textPrimary,
    },
  });
