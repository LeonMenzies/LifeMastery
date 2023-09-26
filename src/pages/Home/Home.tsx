import { SafeAreaView } from "react-native";
import { useEffect } from "react";
import HomeHeader from "./HomeHeader";
import { useRecoilState, useSetRecoilState } from "recoil";
import { actionsAtom } from "../../recoil/actionsAtom";
import { alertAtom } from "../../recoil/alertAtom";
import { getActions } from "../../utils/ActionsHandler";
import { getAreasOfImportance } from "../../utils/AreasOfImportanceHandler";
import { areasOfImportanceAtom } from "../../recoil/areasOfImportanceAtom";
import HomeActionSection from "./HomeActionSection";
import { AreaOfImportanceItemT } from "../../types/Types";

const Home = () => {
  const [data, setData] = useRecoilState(actionsAtom);
  const setAlert = useSetRecoilState(alertAtom);
  const [areasOfImportance, setAreasOfImportance] = useRecoilState(areasOfImportanceAtom);

  useEffect(() => {
    getActions(setAlert, setData);
    getAreasOfImportance(setAlert, setAreasOfImportance);
  }, []);

  return (
    <SafeAreaView>
      <HomeHeader focus={"Test"} />

      {areasOfImportance.map((aoi: AreaOfImportanceItemT) => {
        return <HomeActionSection key={aoi.key} aoi={aoi} data={data} />;
      })}
    </SafeAreaView>
  );
};

export default Home;
