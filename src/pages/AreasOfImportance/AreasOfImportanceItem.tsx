import { FC } from "react";

import { TouchableOpacity, Text, View, StyleSheet, Dimensions } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import SwipeableItem from "react-native-swipeable-item";

import { deleteAreaOfImportance } from "~utils/AreasOfImportanceHandler";
import { alertAtom } from "~recoil/alertAtom";
import { areasOfImportanceAtom } from "~recoil/areasOfImportanceAtom";
import { AreaOfImportanceItemT, ThemeT } from "~types/Types";
import { themeAtom } from "~recoil/themeAtom";

type AreasOfImportanceItemT = {
  item: AreaOfImportanceItemT;
};

export const AreasOfImportanceItem: FC<AreasOfImportanceItemT> = ({ item }) => {
  const setAlert = useSetRecoilState(alertAtom);
  const setData = useSetRecoilState(areasOfImportanceAtom);
  const colors = useRecoilValue(themeAtom);
  const windowWidth = Dimensions.get("window").width;
  const styles = styling(item.Color, colors, windowWidth);

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
    <TouchableOpacity onLongPress={() => {}}>
      <View style={styles.container}>
        <Text style={styles.aoiText}>{item.AOI}</Text>
        <View style={styles.aoiColor} />
      </View>
    </TouchableOpacity>
  );
};

const styling = (color: string, colors: ThemeT, windowWidth: number) =>
  StyleSheet.create({
    container: {
      paddingTop: 5,
      paddingBottom: 5,
      width: windowWidth - 50,
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: colors.background,
    },
    aoiColor: {
      backgroundColor: color,
      width: 15,
      height: 15,
    },
    aoiText: {
      fontSize: 17,
      color: colors.textPrimary,
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
