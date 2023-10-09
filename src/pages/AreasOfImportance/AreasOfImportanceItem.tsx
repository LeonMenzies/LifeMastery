import { FC } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import SwipeableItem from "react-native-swipeable-item";

import { deleteAreaOfImportance } from "~utils/AreasOfImportanceHandler";
import { alertAtom } from "~recoil/alertAtom";
import { areasOfImportanceAtom } from "~recoil/areasOfImportanceAtom";
import { AreaOfImportanceItemT, ThemeT } from "~types/Types";
import { themeAtom } from "~recoil/themeAtom";

type AreasOfImportanceItemT = {
  item: AreaOfImportanceItemT;
  drag: any;
  isActive: boolean;
};

export const AreasOfImportanceItem: FC<AreasOfImportanceItemT> = ({ item, drag, isActive }) => {
  const setAlert = useSetRecoilState(alertAtom);
  const setData = useSetRecoilState(areasOfImportanceAtom);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(item.Color, colors);

  const UnderlayRight = () => {
    return (
      <View style={styles.underlayRight}>
        <TouchableOpacity onPress={() => deleteAreaOfImportance(setAlert, setData, item.key)}>
          <Text style={styles.underlayText}>X</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SwipeableItem
      key={item.key}
      item={item}
      renderUnderlayLeft={UnderlayRight}
      snapPointsLeft={[50]}
    >
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={{ backgroundColor: isActive ? item.Color : "white" }}
      >
        <View style={styles.container}>
          <Text style={styles.aoiText}>{item.AOI}</Text>
          <View style={styles.aoiColor} />
        </View>
      </TouchableOpacity>
    </SwipeableItem>
  );
};

const styling = (color: string, colors: ThemeT) =>
  StyleSheet.create({
    container: {
      paddingTop: 5,
      paddingBottom: 5,
      width: 300,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    aoiColor: {
      backgroundColor: color,
      width: 15,
      height: 15,
    },
    aoiText: {
      fontSize: 17,
    },
    underlayText: {
      color: colors.white,
      fontSize: 22,
      fontWeight: "bold",
    },
    underlayRight: {
      flex: 1,
      width: 50,
      backgroundColor: "tomato",
      alignSelf: "flex-end",
      justifyContent: "center",
      alignItems: "center",
    },
  });
