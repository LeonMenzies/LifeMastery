import { SafeAreaView, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { HomeHeader } from "~pages/Home/HomeHeader";
import { actionsAtom } from "~recoil/actionsAtom";
import { alertAtom } from "~recoil/alertAtom";
import { getActions } from "~utils/ActionsHandler";
import { getAreasOfImportance } from "~utils/AreasOfImportanceHandler";
import { HomeActionSection } from "~pages/Home/HomeActionSection";
import { AreaOfImportanceItemT, PlanT, ThemeT } from "~types/Types";
import { getPlan } from "~utils/PlanHandler";
import { planAtom } from "~recoil/planAtom";
import { themeAtom } from "~recoil/themeAtom";

export const Home = ({ navigation }) => {
  const TODAY_PLAN = "today-plan";

  const setAlert = useSetRecoilState(alertAtom);
  const [plan, setPlan] = useRecoilState<PlanT>(planAtom);
  const [actions, setActions] = useRecoilState(actionsAtom);
  const [areasOfImportance, setAreasOfImportance] = useState([]);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  useEffect(() => {
    if (!plan.finalized) {
      setAlert("You must finalize today first");
      navigation.navigate("Plan");
    } else {
      getAreasOfImportance(setAlert, setAreasOfImportance);
    }
  }, [navigation]);

  useEffect(() => {
    getPlan(setAlert, setPlan, TODAY_PLAN);
    getActions(setAlert, setActions, true);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader focus={plan.focus} />

      {areasOfImportance.map((aoi: AreaOfImportanceItemT) => {
        return (
          <HomeActionSection
            key={aoi.key}
            aoi={aoi}
            data={actions}
            setActions={setActions}
            actionKeys={plan.actionKeys}
          />
        );
      })}
    </SafeAreaView>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      height: "100%",
    },
  });
