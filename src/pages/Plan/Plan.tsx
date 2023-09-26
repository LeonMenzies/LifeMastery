import { SafeAreaView, Text } from "react-native";
import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { actionsAtom } from "../../recoil/actionsAtom";
import { alertAtom } from "../../recoil/alertAtom";
import { getActions } from "../../utils/ActionsHandler";
import { getAreasOfImportance } from "../../utils/AreasOfImportanceHandler";
import { areasOfImportanceAtom } from "../../recoil/areasOfImportanceAtom";
import { AreaOfImportanceItemT } from "../../types/Types";

const Plan = () => {
  const [data, setData] = useRecoilState(actionsAtom);
  const setAlert = useSetRecoilState(alertAtom);
  const [areasOfImportance, setAreasOfImportance] = useRecoilState(areasOfImportanceAtom);

  return (
    <SafeAreaView>
      <Text>Test</Text>
    </SafeAreaView>
  );
};

export default Plan;
