import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { ScaleDecorator } from "react-native-draggable-flatlist";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { updateAction } from "~utils/ActionsHandler";
import { alertAtom } from "~recoil/alertAtom";
import { PlanSetPriority } from "~pages/Plan/PlanSetPriority";
import { useState } from "react";
import { ThemeT, ActionItemT } from "~types/Types";
import { themeAtom } from "~recoil/themeAtom";
import { convertTime } from "~utils/Helpers";

type PlanActionsListItemT = {
  item: ActionItemT;
  drag: any;
  isActive: boolean;
  setActions: any;
  addAction: (k: string) => void;
  removeAction: (k: string) => void;
  isInPlan: boolean;
};

export const PlanActionsListItem = ({
  item,
  drag,
  isActive,
  setActions,
  addAction,
  removeAction,
  isInPlan,
}: PlanActionsListItemT) => {
  const setAlert = useSetRecoilState(alertAtom);
  const [modalVisible, setModalVisible] = useState(false);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

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
    <ScaleDecorator key={item.key}>
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={{ backgroundColor: isActive ? colors.lightGrey : colors.white }}
        onPress={() => {
          if (isInPlan) {
            handleCancel();
          } else {
            setModalVisible(true);
          }
        }}
      >
        <View style={styles.container}>
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
        </View>
        <PlanSetPriority
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          actionTitle={item.action}
          handleSetPriority={handleSetPriority}
          handleCancel={handleCancel}
        />
      </TouchableOpacity>
    </ScaleDecorator>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      paddingTop: 5,
      paddingBottom: 5,
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
      fontSize: 17,
    },
    actionTitleContainer: {
      flexDirection: "row",
      gap: 4,
    },
    actionDate: {
      fontSize: 13,
      color: colors.grey,
    },
    inPlan: {
      width: 3,
      backgroundColor: colors.success,
    },
  });
