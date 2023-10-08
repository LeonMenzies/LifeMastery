import { SafeAreaView, StyleSheet, View, TouchableHighlight, Text } from "react-native";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { alertAtom } from "~recoil/alertAtom";
import { PlanT, ThemeT, actionItemT } from "~types/Types";
import { getActions } from "~utils/ActionsHandler";
import { PlanCard } from "~pages/Plan/PlanCard";
import { getPlan } from "~utils/PlanHandler";
import { planAtom } from "~recoil/planAtom";
import { themeAtom } from "~recoil/themeAtom";
import { actionsAtom } from "~recoil/actionsAtom";

export const Plan = ({ navigation }) => {
  const TODAY_PLAN = "today-plan";
  const TOMORROW_PLAN = "tomorrow-plan";

  const setAlert = useSetRecoilState(alertAtom);
  const [today, setToday] = useState(true);
  const [actions, setActions] = useRecoilState(actionsAtom);
  const [plan, setPlan] = useRecoilState<PlanT>(planAtom);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(today, colors);

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
          underlayColor={colors.grey}
          style={styles.buttonToday}
          onPress={() => setToday(true)}
        >
          <Text style={styles.buttonText}>{"Today"}</Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={colors.grey}
          style={styles.buttonTomorrow}
          onPress={() => setToday(false)}
        >
          <Text style={styles.buttonText}>{"Tomorrow"}</Text>
        </TouchableHighlight>
      </View>
      {today ? (
        <PlanCard
          day={TODAY_PLAN}
          actions={actions}
          setActions={setActions}
          navigation={navigation}
        />
      ) : (
        <PlanCard
          day={TOMORROW_PLAN}
          actions={actions}
          setActions={setActions}
          navigation={navigation}
        />
      )}
    </SafeAreaView>
  );
};

const styling = (today: boolean, colors: ThemeT) =>
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
      backgroundColor: today ? colors.white : colors.grey,
      alignItems: "center",
      justifyContent: "center",
      width: "50%",
      height: 30,
    },
    buttonTomorrow: {
      backgroundColor: today ? colors.grey : colors.white,
      alignItems: "center",
      justifyContent: "center",
      width: "50%",
      height: 30,
    },
    buttonText: {
      fontSize: 15,
    },
  });
