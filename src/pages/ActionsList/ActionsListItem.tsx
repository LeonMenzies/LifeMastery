import { TouchableOpacity, Text, View, StyleSheet, Dimensions } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { FC } from "react";

import { createActionAtom } from "~recoil/createActionAtom";
import { ThemeT, ActionItemT } from "~types/Types";
import { themeAtom } from "~recoil/themeAtom";
import { convertTime } from "~utils/Helpers";
import { CheckBoxInput } from "~components/CheckBoxInput";

type ActionsListItemT = {
  item: ActionItemT;
  setModalVisible: any;
  deleteItem: boolean;
  setDeleteItem: Function;
  deleteItems: string[];
  setDeleteItems: Function;
};

export const ActionsListItem: FC<ActionsListItemT> = ({
  item,
  setModalVisible,
  deleteItem,
  setDeleteItem,
  deleteItems,
  setDeleteItems,
}) => {
  function toggleItemInArray() {
    if (deleteItem)
      setDeleteItems(
        deleteItems.includes(item.key)
          ? deleteItems.filter((val) => val !== item.key)
          : [...deleteItems, item.key]
      );
  }

  const setAction = useSetRecoilState(createActionAtom);
  const colors = useRecoilValue(themeAtom);
  const windowWidth = Dimensions.get("window").width;
  const styles = styling(colors, windowWidth);

  return (
    <TouchableOpacity
      onLongPress={() => setDeleteItem(true)}
      onPress={() => {
        if (!deleteItem) {
          setModalVisible({
            show: true,
            newAction: false,
          });
          setAction(item);
        }
      }}
      activeOpacity={deleteItem ? 1 : 0.2}
    >
      <View style={styles.container}>
        <View style={styles.actionHeading}>
          <View style={styles.actionTitleContainer}>
            {item.isCompleted && <View style={styles.inPlan} />}

            <Text style={styles.actionTitle}>{item.action}</Text>
          </View>
          {deleteItem ? (
            <CheckBoxInput
              onPress={toggleItemInArray}
              completed={deleteItems.includes(item.key)}
              color={colors.error}
              disabled={false}
            />
          ) : (
            <Text style={styles.actionTitle}>{convertTime(item.timeEstimate)}</Text>
          )}
        </View>

        {!deleteItem && (
          <View style={styles.actionHeading}>
            <View style={styles.actionSubTitleContainer}>
              <Text style={styles.actionDate}>{item.areaOfImportance}</Text>
            </View>
            <Text style={styles.actionDate}>{item.dateAdded}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styling = (colors: ThemeT, windowWidth: number) =>
  StyleSheet.create({
    container: {
      padding: 10,
      width: windowWidth - 50,
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
    inPlan: {
      width: 3,
      backgroundColor: colors.success,
    },
  });
