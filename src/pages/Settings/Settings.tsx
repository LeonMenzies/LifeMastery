import { View, Modal, StyleSheet } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { themeAtom } from "~recoil/themeAtom";
import { clearActions } from "~utils/ActionsHandler";
import { alertAtom } from "~recoil/alertAtom";
import { clearPlan } from "~utils/PlanHandler";
import { ThemeT } from "~types/Types";
import { Button } from "~components/Button";
import { SettingsThemeSelect } from "~pages/Settings/SettingsThemeSelect";

type SettingsT = {
  modalVisible: boolean;
  setModalVisible: any;
};

export const Settings = ({ modalVisible, setModalVisible }: SettingsT) => {
  const TODAY_PLAN = "today-plan";
  const TOMORROW_PLAN = "tomorrow-plan";

  const setAlert = useSetRecoilState(alertAtom);
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
          <SettingsThemeSelect />
          <Button title="Clear Actions" onPress={() => clearActions(setAlert)} />
          <Button title="Clear Todays Plan" onPress={() => clearPlan(setAlert, TODAY_PLAN)} />
          <Button title="Clear Tomorrows Plan" onPress={() => clearPlan(setAlert, TOMORROW_PLAN)} />
          <Button title="Clear Everything" onPress={() => AsyncStorage.clear()} />
          <Button title="Close" onPress={() => setModalVisible(false)} />
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
      height: "50%",
      width: "70%",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      elevation: 5,
    },
  });
