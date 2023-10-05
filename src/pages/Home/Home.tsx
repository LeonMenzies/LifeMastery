import { SafeAreaView, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

import { HomeHeader } from "~pages/Home/HomeHeader";
import { actionsAtom } from "~recoil/actionsAtom";
import { alertAtom } from "~recoil/alertAtom";
import { getActions } from "~utils/ActionsHandler";
import { getAreasOfImportance } from "~utils/AreasOfImportanceHandler";
import { HomeActionSection } from "~pages/Home/HomeActionSection";
import { AreaOfImportanceItemT, PlanT } from "~types/Types";
import { colors } from "~styles/GlobalStyles";
import { getPlan } from "~utils/PlanHandler";
import { planAtom } from "~recoil/planAtom";

export const Home = ({ navigation }) => {
  const TODAY_PLAN = "today-plan";

  const setAlert = useSetRecoilState(alertAtom);
  const [plan, setPlan] = useRecoilState<PlanT>(planAtom);
  // const [actions, setActions] = useRecoilState(actionsAtom);

  const [areasOfImportance, setAreasOfImportance] = useState([]);
  const [actions, setActions] = useState([]);

  useEffect(() => {
    if (!plan.finalized) {
      setAlert("You must finalize today first");
      navigation.navigate("Plan");
    } else {
      getAreasOfImportance(setAlert, setAreasOfImportance);
      setActions(plan.actionItems);
    }
  }, []);

  useEffect(() => {
    getPlan(setAlert, setPlan, TODAY_PLAN);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader focus={plan.focus} />

      {areasOfImportance.map((aoi: AreaOfImportanceItemT) => {
        return <HomeActionSection key={aoi.key} aoi={aoi} data={actions} setActions={setActions} />;
      })}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    height: "100%",
  },
});
