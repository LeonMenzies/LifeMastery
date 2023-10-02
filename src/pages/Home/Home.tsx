import { SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

import { HomeHeader } from "~pages/Home/HomeHeader";
import { actionsAtom } from "~recoil/actionsAtom";
import { alertAtom } from "~recoil/alertAtom";
import { getActions } from "~utils/ActionsHandler";
import { getAreasOfImportance } from "~utils/AreasOfImportanceHandler";
import { areasOfImportanceAtom } from "~recoil/areasOfImportanceAtom";
import { HomeActionSection } from "~pages/Home/HomeActionSection";
import { AreaOfImportanceItemT } from "~types/Types";

export const Home = () => {
  const setAlert = useSetRecoilState(alertAtom);
  // const [areasOfImportance, setAreasOfImportance] = useRecoilState(areasOfImportanceAtom);
  // const [actions, setActions] = useRecoilState(actionsAtom);

  const [actions, setActions] = useState([]);
  const [areasOfImportance, setAreasOfImportance] = useState([]);

  useEffect(() => {
    getActions(setAlert, setActions);
  }, []);

  useEffect(() => {
    getAreasOfImportance(setAlert, setAreasOfImportance);
  }, [actions]);

  return (
    <SafeAreaView>
      <HomeHeader focus={"Test"} />

      {areasOfImportance.map((aoi: AreaOfImportanceItemT) => {
        return <HomeActionSection key={aoi.key} aoi={aoi} data={actions} setActions={setActions}/>;
      })}
    </SafeAreaView>
  );
};
