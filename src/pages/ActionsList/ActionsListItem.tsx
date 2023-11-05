import { TouchableOpacity, Text, View, StyleSheet, Dimensions } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import SwipeableItem from "react-native-swipeable-item";
import { FC } from "react";

import { deleteAction } from "~utils/ActionsHandler";
import { alertAtom } from "~recoil/alertAtom";
import { createActionAtom } from "~recoil/createActionAtom";
import { ThemeT, ActionItemT } from "~types/Types";
import { themeAtom } from "~recoil/themeAtom";
import { actionsAtom } from "~recoil/actionsAtom";
import { convertTime } from "~utils/Helpers";

type ActionsListItemT = {
  item: ActionItemT;
  setModalVisible: any;
};

export const ActionsListItem: FC<ActionsListItemT> = ({ item, setModalVisible }) => {
  const setAlert = useSetRecoilState(alertAtom);
  const setActions = useSetRecoilState(actionsAtom);

  const setAction = useSetRecoilState(createActionAtom);
  const colors = useRecoilValue(themeAtom);
  const windowWidth = Dimensions.get("window").width;
  const styles = styling(colors, windowWidth);

  return (
    <TouchableOpacity
      onLongPress={() => {}}
      onPress={() => {
        setModalVisible({
          show: true,
          newAction: false,
        });
        setAction(item);
      }}
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
  );
};

const styling = (colors: ThemeT, windowWidth: number) =>
  StyleSheet.create({
    container: {
      paddingTop: 5,
      paddingBottom: 5,
      width: windowWidth - 50,
      backgroundColor: colors.background,
    },
    actionHeading: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    actionTitle: {
      fontSize: 17,
      color: colors.textPrimary,
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
