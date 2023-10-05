import { TouchableOpacity, Text, View, Button, StyleSheet } from "react-native";
import { ScaleDecorator } from "react-native-draggable-flatlist";
import { useSetRecoilState } from "recoil";
import SwipeableItem, { useSwipeableItemParams } from "react-native-swipeable-item";

import { deleteAreaOfImportance } from "~utils/AreasOfImportanceHandler";
import { alertAtom } from "~recoil/alertAtom";
import { areasOfImportanceAtom } from "~recoil/areasOfImportanceAtom";
import { AreaOfImportanceItemT } from "~types/Types";
import { colors } from "~styles/GlobalStyles";

type AreasOfImportanceItemT = {
  item: AreaOfImportanceItemT;
  drag: any;
  isActive: boolean;
};

export const AreasOfImportanceItem = ({ item, drag, isActive }: AreasOfImportanceItemT) => {
  const setAlert = useSetRecoilState(alertAtom);
  const setData = useSetRecoilState(areasOfImportanceAtom);
  const styles = styling(item.Color);

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

const styling = (color: string) =>
  StyleSheet.create({
    container: {
      padding: 7,
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
