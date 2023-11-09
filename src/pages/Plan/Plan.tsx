import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  TouchableOpacity,
  PanResponder,
} from "react-native";
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
import { PlanDayButton } from "./PlanDayButton";
import React from "react";

export const Plan: FC<any> = () => {
  const setAlert = useSetRecoilState(alertAtom);
  const [today, setToday] = useState(true);
  const [modalVisible, setModalVisible] = useState<{ show: boolean; newAction: boolean }>({
    show: false,
    newAction: true,
  });
  const setActions = useSetRecoilState(actionsAtom);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors, today);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dx > 50) {
          setToday(true);
        } else if (gestureState.dx < -50) {
          setToday(false);
        }
      },
    })
  ).current;

  useEffect(() => {
    getActions(setAlert, setActions);
  }, []);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.addContainer}>
        <IconButton
          icon={"plus"}
          color={colors.primary}
          onPress={() =>
            setModalVisible({
              show: true,
              newAction: true,
            })
          }
        />
      </View>
      <View style={styles.buttonContainer}>
        <PlanDayButton title={"today"} onPress={() => setToday(true)} selected={today} />
        <PlanDayButton title={"today"} onPress={() => setToday(false)} selected={!today} />
      </View>
      {today ? <PlanCard day={TODAY_PLAN} /> : <PlanCard day={TOMORROW_PLAN} />}
      <ActionAddEdit modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </View>
  );
};

const styling = (colors: ThemeT, today: boolean) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      flex: 1,
    },
    addContainer: {
      marginTop: 50,
      width: "100%",
      paddingLeft: 10,
    },
    buttonContainer: {
      borderRadius: 5,
      borderColor: colors.primary,
      borderWidth: 2,
      flexDirection: "row",
      width: "80%",
    },
  });
