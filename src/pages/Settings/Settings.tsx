import { View, Modal, StyleSheet, Text } from "react-native";
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

  const SettingsItem = ({ title, callBack, buttonTitle = "Clear" }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemInnerContainer}>
          <Text style={styles.itemText}>{title}</Text>
          <Button title={buttonTitle} onPress={callBack} />
        </View>
        <View style={styles.divider} />
      </View>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View>
            <SettingsThemeSelect />
            <SettingsItem title="Clear Actions" callBack={() => clearActions(setAlert)} />
            <SettingsItem
              title="Clear Todays Plan"
              callBack={() => clearPlan(setAlert, TODAY_PLAN)}
            />
            <SettingsItem
              title="Clear Tomorrows Plan"
              callBack={() => clearPlan(setAlert, TOMORROW_PLAN)}
            />
          </View>
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
      width: "80%",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      elevation: 5,
      justifyContent: "space-between",
    },
    itemContainer: {
      width: 300,
    },
    itemInnerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 3,
    },
    itemText: {
      fontSize: 17,
    },
    divider: {
      borderBottomColor: "black",
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
  });
