import { TouchableOpacity, Text, View, StyleSheet, Dimensions } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { FC, useState } from "react";

import { updateAction } from "~utils/ActionsHandler";
import { alertAtom } from "~recoil/alertAtom";
import { PlanSetPriority } from "~pages/Plan/PlanSetPriority";
import { ThemeT, ActionItemT } from "~types/Types";
import { themeAtom } from "~recoil/themeAtom";
import { convertTime } from "~utils/Helpers";

type PlanActionsListItemT = {
  item: ActionItemT;
  setActions: any;
  addAction: (k: string) => void;
  removeAction: (k: string) => void;
  isInPlan: boolean;
  finalized: boolean;
};

export const PlanActionsListItem: FC<PlanActionsListItemT> = ({
  item,
  setActions,
  addAction,
  removeAction,
  isInPlan,
  finalized,
}) => {
  const setAlert = useSetRecoilState(alertAtom);
  const [modalVisible, setModalVisible] = useState(false);
  const windowWidth = Dimensions.get("window").width;
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors, windowWidth);

  const handleSetPriority = (val: number) => {
    updateAction(setAlert, setActions, { ...item, priority: val });
    addAction(item.key);
    setModalVisible(false);
  };

  const handleCancel = () => {
    updateAction(setAlert, setActions, { ...item, priority: 0 });
    setModalVisible(false);
    removeAction(item.key);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onLongPress={() => {}}
        onPress={() => {
          if (finalized) {
            return;
          } else if (isInPlan) {
            handleCancel();
          } else {
            setModalVisible(true);
          }
        }}
        activeOpacity={finalized ? 1 : 0.4}
      >
        <View style={styles.actionHeading}>
          <View style={styles.actionTitleContainer}>
            {isInPlan && <View style={styles.inPlan} />}
            <Text style={styles.actionTitle}>{item.action}</Text>
          </View>
          <Text style={styles.actionTitle}>{isInPlan ? item.priority : 0}</Text>
        </View>
        <View style={styles.actionSubHeading}>
          <Text style={styles.actionDate}>{item.dateAdded}</Text>
          <Text style={styles.actionDate}>{convertTime(item.timeEstimate)}</Text>
        </View>
        <PlanSetPriority
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          actionTitle={item.action}
          handleSetPriority={handleSetPriority}
          handleCancel={handleCancel}
        />
      </TouchableOpacity>
    </View>
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
    actionSubHeading: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    actionTitle: {
      fontSize: 18,
      color: colors.textPrimary,
    },
    actionTitleContainer: {
      flexDirection: "row",
      gap: 4,
    },
    actionDate: {
      fontSize: 14,
      color: colors.grey,
    },
    inPlan: {
      width: 3,
      backgroundColor: colors.success,
    },
  });
