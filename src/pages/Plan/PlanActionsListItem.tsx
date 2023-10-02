import styled from "styled-components/native";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { ScaleDecorator } from "react-native-draggable-flatlist";
import { AntDesign } from "@expo/vector-icons";
import { useRecoilState, useSetRecoilState } from "recoil";

import { updateAction } from "~utils/ActionsHandler";
import { alertAtom } from "~recoil/alertAtom";
import { actionsAtom } from "~recoil/actionsAtom";
import { colors } from "~styles/GlobalStyles";
import { PlanSetPriority } from "~pages/Plan/PlanSetPriority";
import { useState } from "react";
import { actionItemT } from "~types/Types";

type PlanActionsListItemT = {
  item: actionItemT;
  drag: any;
  isActive: boolean;
  setActions: any;
  setPlanActions: any;
  isInPlan: boolean;
};

export const PlanActionsListItem = ({
  item,
  drag,
  isActive,
  setActions,
  setPlanActions,
  isInPlan,
}: PlanActionsListItemT) => {
  const setAlert = useSetRecoilState(alertAtom);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSetPriority = (val: number) => {
    updateAction(setAlert, setActions, { ...item, priority: val });
    setPlanActions((actions) => [...actions, item]);
    setModalVisible(false);
  };

  const handleCancel = () => {
    updateAction(setAlert, setActions, { ...item, priority: 0 });
    setModalVisible(false);
    setPlanActions((actions) => actions.filter((action: actionItemT) => action.key !== item.key));
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
              {isInPlan && <View style={styles.inPlain} />}
              <Text style={styles.actionTitle}>{item.action}</Text>
            </View>
            <Text style={styles.actionTitle}>{item.priority}</Text>
          </View>
          <View>
            <Text style={styles.actionDate}>{item.dateAdded}</Text>
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

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
    paddingBottom: 5,
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
  inPlain: {
    width: 3,
    backgroundColor: colors.green,
  },
});
