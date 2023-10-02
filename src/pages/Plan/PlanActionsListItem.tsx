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
};

export const PlanActionsListItem = ({ item, drag, isActive, setActions }: PlanActionsListItemT) => {
  const setAlert = useSetRecoilState(alertAtom);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSetPriority = (val: number) => {
    updateAction(setAlert, setActions, { ...item, priority: val });
  };

  return (
    <ScaleDecorator key={item.key}>
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={{ backgroundColor: isActive ? colors.lightGrey : colors.white }}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.container}>
          <View style={styles.actionHeading}>
            <Text style={styles.actionTitle}>{item.action}</Text>
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
          setPriority={handleSetPriority}
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
  actionDate: {
    fontSize: 15,
    color: colors.darkGrey,
  },
});
