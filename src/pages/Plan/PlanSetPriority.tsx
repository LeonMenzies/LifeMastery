import "react-native-get-random-values";
import { useEffect, useState, FC } from "react";
import { Modal, StyleSheet, View, Text } from "react-native";

import { Button } from "~components/Button";
import { NumberInput } from "~components/NumberInput";
import { useRecoilValue } from "recoil";
import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

type PlanSetPriorityT = {
  actionTitle: string;
  handleSetPriority: (v: number) => void;
  modalVisible: boolean;
  setModalVisible: any;
  handleCancel: any;
};

export const PlanSetPriority: FC<PlanSetPriorityT> = ({
  actionTitle,
  handleSetPriority,
  modalVisible,
  setModalVisible,
  handleCancel,
}) => {
  const [priorityValue, setPriorityValue] = useState(1);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  useEffect(() => {
    setPriorityValue(1);
  }, []);

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
            <Button title="Set" onPress={() => handleSetPriority(priorityValue)} />
            <Button title="Cancel" onPress={handleCancel} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
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
