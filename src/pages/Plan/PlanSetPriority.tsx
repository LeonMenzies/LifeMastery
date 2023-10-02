import "react-native-get-random-values";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, View, Text } from "react-native";
import { useSetRecoilState, useRecoilState } from "recoil";

import { Select } from "~components/Select";
import { getAreasOfImportance } from "~utils/AreasOfImportanceHandler";
import { addAction } from "~utils/ActionsHandler";
import { TextInput } from "~components/TextInput";
import { alertAtom } from "~recoil/alertAtom";
import { actionsAtom } from "~recoil/actionsAtom";
import { areasOfImportanceAtom } from "~recoil/areasOfImportanceAtom";
import { Button } from "~components/Button";
import { colors } from "~styles/GlobalStyles";
import { NumberInput } from "~components/NumberInput";

type PlanSetPriorityT = {
  actionTitle: string;
  setPriority: (v: number) => void;
  modalVisible: boolean;
  setModalVisible: any;
};

export const PlanSetPriority = ({
  actionTitle,
  setPriority,
  modalVisible,
  setModalVisible,
}: PlanSetPriorityT) => {
  const [priorityValue, setPriorityValue] = useState(0);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{actionTitle}</Text>
          <NumberInput onChange={setPriorityValue} value={priorityValue} maxValue={5} />

          <View style={styles.buttonContainer}>
            <Button
              title="Set"
              onPress={() => {
                setPriority(priorityValue);
                setModalVisible(false);
                setPriorityValue(0);
              }}
            />
            <Button
              title="Cancel"
              onPress={() => {
                setModalVisible(false);
                setPriorityValue(0);
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.white,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    elevation: 5,
  },
  buttonContainer: {
    padding: 10,
    flexDirection: "row",
  },
  modalTitle: {
    fontSize: 17,
  },
});

export default PlanSetPriority;
