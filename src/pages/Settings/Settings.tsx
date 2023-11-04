import { View, StyleSheet, Text } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { FC } from "react";

import { themeAtom } from "~recoil/themeAtom";
import { clearActions } from "~utils/ActionsHandler";
import { alertAtom } from "~recoil/alertAtom";
import { clearPlan } from "~utils/PlanHandler";
import { ThemeT } from "~types/Types";
import { Button } from "~components/Button";
import { SettingsThemeSelect } from "~pages/Settings/SettingsThemeSelect";
import { SettingsCompleteSelect } from "~pages/Settings/SettingsCompleteSelect";
import { planAtom } from "~recoil/planAtom";
import { actionsAtom } from "~recoil/actionsAtom";
import { Modal } from "~components/Modal";

type SettingsT = {
  modalVisible: boolean;
  setModalVisible: any;
};

export const Settings: FC<SettingsT> = ({ modalVisible, setModalVisible }) => {
  const TODAY_PLAN = "today-plan";
  const TOMORROW_PLAN = "tomorrow-plan";

  const setAlert = useSetRecoilState(alertAtom);
  const setPlan = useSetRecoilState(planAtom);
  const setActions = useSetRecoilState(actionsAtom);
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
    <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
      <View>
        <SettingsThemeSelect />
        <SettingsCompleteSelect />
        <SettingsItem title="Clear Actions" callBack={() => clearActions(setAlert, setActions)} />
        <SettingsItem
          title="Clear Todays Plan"
          callBack={() => clearPlan(setAlert, setPlan, TODAY_PLAN)}
        />
        <SettingsItem
          title="Clear Tomorrows Plan"
          callBack={() => clearPlan(setAlert, setPlan, TOMORROW_PLAN)}
        />
      </View>
      <Button title="Close" onPress={() => setModalVisible(false)} />
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
      color: colors.textPrimary,
    },
    divider: {
      borderBottomColor: colors.textPrimary,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
  });
