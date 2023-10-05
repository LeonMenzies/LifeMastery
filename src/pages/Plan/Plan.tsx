import { SafeAreaView, StyleSheet, View, TouchableHighlight, Text } from "react-native";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import DraggableFlatList from "react-native-draggable-flatlist";

import { alertAtom } from "~recoil/alertAtom";
import { TextInput } from "~components/TextInput";
import { colors } from "~styles/GlobalStyles";
import { PlanT, actionItemT } from "~types/Types";
import { getActions } from "~utils/ActionsHandler";
import { PlanActionsListItem } from "~pages/Plan/PlanActionsListItem";
import { Button } from "~components/Button";
import { PlanCard } from "./PlanCard";
import { getPlan } from "~utils/PlanHandler";
import { planAtom } from "~recoil/planAtom";

export const Plan = ({ navigation }) => {
  const TODAY_PLAN = "today-plan";
  const TOMORROW_PLAN = "tomorrow-plan";

  const setAlert = useSetRecoilState(alertAtom);
  const [today, setToday] = useState(true);
  const [actions, setActions] = useState<actionItemT[]>([]);
  const [plan, setPlan] = useRecoilState<PlanT>(planAtom);

  const styles = styling(today);

  useEffect(() => {
    getActions(setAlert, setActions, true);
  }, []);

  useEffect(() => {
    getPlan(setAlert, setPlan, TODAY_PLAN);
  }, []);

  useEffect(() => {
    if (plan.finalized) {
      navigation.navigate("Home");
    }
  }, [plan]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableHighlight
          underlayColor={colors.darkGrey}
          style={styles.buttonToday}
          onPress={() => setToday(true)}
        >
          <Text style={styles.buttonText}>{"Today"}</Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={colors.darkGrey}
          style={styles.buttonTomorrow}
          onPress={() => setToday(false)}
        >
          <Text style={styles.buttonText}>{"Tomorrow"}</Text>
        </TouchableHighlight>
      </View>
      {today ? (
        <PlanCard day={TODAY_PLAN} actions={actions} setActions={setActions} />
      ) : (
        <PlanCard day={TOMORROW_PLAN} actions={actions} setActions={setActions} />
      )}
    </SafeAreaView>
  );
};

const styling = (today: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      height: "100%",
      alignItems: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      width: "100%",
    },
    buttonToday: {
      backgroundColor: today ? colors.white : colors.lightGrey,
      alignItems: "center",
      justifyContent: "center",
      width: "50%",
      height: 30,
    },
    buttonTomorrow: {
      backgroundColor: today ? colors.lightGrey : colors.white,
      alignItems: "center",
      justifyContent: "center",
      width: "50%",
      height: 30,
    },
    buttonText: {
      fontSize: 15,
    },
  });
