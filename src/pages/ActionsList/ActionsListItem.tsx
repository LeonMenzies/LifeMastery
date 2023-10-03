import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { ScaleDecorator } from "react-native-draggable-flatlist";
import { AntDesign } from "@expo/vector-icons";
import { useSetRecoilState } from "recoil";
import SwipeableItem, { useSwipeableItemParams } from "react-native-swipeable-item";

import { deleteAction } from "~utils/ActionsHandler";
import { alertAtom } from "~recoil/alertAtom";
import { actionsAtom } from "~recoil/actionsAtom";
import { colors } from "~styles/GlobalStyles";
import { actionsShowAddEditAtom } from "~recoil/actionsShowAddEditAtom";
import { actionItemT } from "~types/Types";

type ActionsListItemT = {
  item: actionItemT;
  drag: any;
  isActive: boolean;
  setActions: any;
};

export const ActionsListItem = ({ item, drag, isActive, setActions }: ActionsListItemT) => {
  const setAlert = useSetRecoilState(alertAtom);
  const setActionsShowAddEdit = useSetRecoilState(actionsShowAddEditAtom);

  const UnderlayRight = () => {
    return (
      <View style={styles.underlayRight}>
        <TouchableOpacity onPress={() => deleteAction(setAlert, setActions, item.key)}>
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
        style={{ backgroundColor: isActive ? colors.lightGrey : colors.white }}
        onPress={() =>
          setActionsShowAddEdit({
            show: true,
            action: item,
          })
        }
      >
        <View style={styles.container}>
          <View style={styles.actionHeading}>
            <View style={styles.actionTitleContainer}>
              <Text style={styles.actionTitle}>{item.action}</Text>
            </View>
            <Text style={styles.actionTitle}>{item.dateAdded}</Text>
          </View>
          <View>
            <Text style={styles.actionDate}>{item.areaOfImportance}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </SwipeableItem>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
    paddingBottom: 5,
    width: 300,
  },
  actionHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionTitle: {
    fontSize: 17,
  },
  actionTitleContainer: {
    flexDirection: "row",
    gap: 4,
  },
  actionDate: {
    fontSize: 13,
    color: colors.darkGrey,
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
