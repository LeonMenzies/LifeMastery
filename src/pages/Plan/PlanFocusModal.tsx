import "react-native-get-random-values";
import { FC } from "react";
import { Modal, StyleSheet, View } from "react-native";

import { Button } from "~components/Button";
import { useRecoilValue } from "recoil";
import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";
import { TextInput } from "~components/TextInput";

type PlanFocusModalT = {
  modalVisible: boolean;
  setModalVisible: Function;
  handleFinalize: any;
  updateFocus: any;
  focusValue: string;
};

export const PlanFocusModal: FC<PlanFocusModalT> = ({
  modalVisible,
  setModalVisible,
  handleFinalize,
  updateFocus,
  focusValue,
}) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            title={"My Key Focus For Today"}
            onChangeText={updateFocus}
            value={focusValue}
            placeholder="Add focus..."
            keyboardType="default"
            maxLength={30}
          />

          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
            <Button title="Save" onPress={handleFinalize} />
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
      backgroundColor: colors.background,
      padding: 20,
      borderRadius: 20,
      alignItems: "center",
      width: "80%",
    },
    buttonContainer: {
      padding: 10,
      flexDirection: "row",
      gap: 14,
    },
    modalTitle: {
      fontSize: 24,
      color: colors.textPrimary,
    },
  });
