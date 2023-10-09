import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import SwipeableItem from "react-native-swipeable-item";
import { FC } from "react";

import { deleteAction } from "~utils/ActionsHandler";
import { alertAtom } from "~recoil/alertAtom";
import { actionsShowAddEditAtom } from "~recoil/actionsShowAddEditAtom";
import { ThemeT, ActionItemT } from "~types/Types";
import { themeAtom } from "~recoil/themeAtom";
import { actionsAtom } from "~recoil/actionsAtom";
import { convertTime } from "~utils/Helpers";

type ActionsListItemT = {
  item: ActionItemT;
  drag: any;
  isActive: boolean;
};

export const ActionsListItem: FC<ActionsListItemT> = ({ item, drag, isActive }) => {
  const setAlert = useSetRecoilState(alertAtom);
  const setActions = useSetRecoilState(actionsAtom);

  const setActionsShowAddEdit = useSetRecoilState(actionsShowAddEditAtom);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

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
            <Text style={styles.actionTitle}>{convertTime(item.timeEstimate)}</Text>
          </View>
          <View style={styles.actionHeading}>
            <View style={styles.actionSubTitleContainer}>
              <Text style={styles.actionDate}>{item.areaOfImportance}</Text>
            </View>
            <Text style={styles.actionDate}>{item.dateAdded}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </SwipeableItem>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
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
    actionSubTitleContainer: {
      flexDirection: "row",
    },
    actionDate: {
      fontSize: 13,
      color: colors.grey,
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
