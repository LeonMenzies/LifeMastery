import { SafeAreaView, StyleSheet, View, TouchableHighlight, Text } from "react-native";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { alertAtom } from "~recoil/alertAtom";
import { ThemeT } from "~types/Types";
import { getActions } from "~utils/ActionsHandler";
import { PlanCard } from "~pages/Plan/PlanCard";
import { themeAtom } from "~recoil/themeAtom";
import { actionsAtom } from "~recoil/actionsAtom";

export const Plan = ({ navigation }) => {
  const TODAY_PLAN = "today-plan";
  const TOMORROW_PLAN = "tomorrow-plan";

  const setAlert = useSetRecoilState(alertAtom);
  const [today, setToday] = useState(true);
  const [actions, setActions] = useRecoilState(actionsAtom);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(today, colors);

  useEffect(() => {
    getActions(setAlert, setActions);
  }, []);

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
      backgroundColor: colors.background,
      height: "100%",
      alignItems: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      width: "100%",
    },
    buttonToday: {
      alignItems: "center",
      justifyContent: "center",
      width: "50%",
      height: 30,
      borderColor: colors.black,
      borderTopWidth: today ? 1 : 0,
      borderBottomWidth: today ? 0 : 1,
      borderRightWidth: today ? 1 : 0,
    },
    buttonTomorrow: {
      alignItems: "center",
      justifyContent: "center",
      width: "50%",
      height: 30,
      borderColor: colors.black,
      borderTopWidth: today ? 0 : 1,
      borderBottomWidth: today ? 1 : 0,
      borderLeftWidth: today ? 0 : 1,
    },
    buttonText: {
      fontSize: 15,
    },
  });
