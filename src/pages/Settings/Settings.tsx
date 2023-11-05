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

export const Settings: FC<any> = () => {
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
    <View style={styles.container}>
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
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      marginTop: 50,
    },
    itemContainer: {
      width: "80%",
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
