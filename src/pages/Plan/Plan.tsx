import { Dimensions, StyleSheet, View } from "react-native";
import { useEffect, useState, FC } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { alertAtom } from "~recoil/alertAtom";
import { ThemeT } from "~types/Types";
import { getActions } from "~utils/ActionsHandler";
import { PlanCard } from "~pages/Plan/PlanCard";
import { themeAtom } from "~recoil/themeAtom";
import { actionsAtom } from "~recoil/actionsAtom";
import { TODAY_PLAN, TOMORROW_PLAN } from "~utils/Constants";
import { IconButton } from "~components/IconButton";
import { ActionAddEdit } from "~components/ActionAddEdit";
import { PlanDayButton } from "~pages/Plan/PlanDayButton";

export const Plan: FC<any> = () => {
  const setAlert = useSetRecoilState(alertAtom);
  const [today, setToday] = useState(true);
  const [modalVisible, setModalVisible] = useState<{ show: boolean; newAction: boolean }>({
    show: false,
    newAction: true,
  });
  const setActions = useSetRecoilState(actionsAtom);
  const windowWidth = Dimensions.get("window").width;
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors, windowWidth);

  useEffect(() => {
    getActions(setAlert, setActions);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.addContainer}>
        <IconButton
          icon={"plus"}
          color={colors.accent}
          onPress={() =>
            setModalVisible({
              show: true,
              newAction: true,
            })
          }
        />
      </View>
      <View style={styles.buttonContainer}>
        <PlanDayButton title={"Today"} onPress={() => setToday(true)} selected={today} />
        <PlanDayButton title={"Tomorrow"} onPress={() => setToday(false)} selected={!today} />
      </View>
      <View style={styles.currentDayContainer}>{today ? <PlanCard day={TODAY_PLAN} /> : <PlanCard day={TOMORROW_PLAN} />}</View>
      <ActionAddEdit modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </View>
  );
};

const styling = (colors: ThemeT, windowWidth: number) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      height: "100%",
    },
    addContainer: {
      paddingLeft: 10,
      width: "100%",
    },
    currentDayContainer: {
      flex: 1,
    },
    buttonContainer: {
      borderRadius: 5,
      borderColor: colors.primary,
      borderWidth: 2,
      flexDirection: "row",
      marginVertical: 5,
      width: windowWidth - 50,
    },
  });
