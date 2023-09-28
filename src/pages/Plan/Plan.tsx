import { SafeAreaView, Text } from "react-native";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { actionsAtom } from "../../recoil/actionsAtom";
import { alertAtom } from "../../recoil/alertAtom";
import { getActions } from "../../utils/ActionsHandler";
import { getAreasOfImportance } from "../../utils/AreasOfImportanceHandler";
import { areasOfImportanceAtom } from "../../recoil/areasOfImportanceAtom";
import { AreaOfImportanceItemT } from "../../types/Types";
import TextInput from "../../components/TextInput";
import Select from "../../components/Select";

const Plan = () => {
  const [data, setData] = useRecoilState(actionsAtom);
  const setAlert = useSetRecoilState(alertAtom);
  const [areasOfImportance, setAreasOfImportance] = useRecoilState(areasOfImportanceAtom);
  const [text, setText] = useState("test action");
  const [select, setSelect] = useState("");

  const options = [
    {
      label: "Test1",
      value: "test1",
    },
    {
      label: "Test2",
      value: "test2",
    },
    {
      label: "Test3",
      value: "test3",
    },
  ];

  return (
    <SafeAreaView>
      <Select title={"Todo"} value={select} onChange={setSelect} options={options} />
      <TextInput
        title={"Focus"}
        onChangeText={setText}
        value={text}
        placeholder="Add value..."
        keyboardType="default"
        maxLength={30}
      />
    </SafeAreaView>
  );
};

export default Plan;
