import { View, Text, SafeAreaView, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import styled from "styled-components/native";
import HomeHeader from "./HomeHeader";
import { storeData, getData } from "../../utils/ActionsHandler";
import { useRecoilState, useSetRecoilState } from "recoil";
import { actionsAtom } from "../../recoil/actionsAtom";
import { alertAtom } from "../../recoil/alertAtom";
import { getActions } from "../../utils/ActionsHandler";
import { getAreasOfImportance } from "../../utils/AreasOfImportanceHandler";
import { areasOfImportanceAtom } from "../../recoil/areasOfImportanceAtom";
import HomeActionItem from "./HomeActionItem";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AntDesign } from "@expo/vector-icons";

const StyledHome = styled.SafeAreaView`
  height: 100%;
`;

const StyledTableHeader = styled.View`
  display: flex;
  flex-direction: row;
`;

const StyledTableField = styled.Text`
  border: solid 1px black;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Home = () => {
  const [data, setData] = useRecoilState(actionsAtom);
  const setAlert = useSetRecoilState(alertAtom);
  const [loading, setLoading] = useState(true);
  const [areasOfImportance, setAreasOfImportance] = useRecoilState(areasOfImportanceAtom);

  useEffect(() => {
    getActions(setAlert, setData, setLoading);
    getAreasOfImportance(setAlert, setAreasOfImportance, setLoading);
  }, []);

  return (
    <StyledHome>
      <HomeHeader />
      <StyledTableHeader>
        <StyledTableField style={{ width: "30%" }}>Category/Project</StyledTableField>
        <StyledTableField style={{ width: "49%" }}>Actions</StyledTableField>
        <StyledTableField style={{ width: "7%" }}>Pri</StyledTableField>
        <StyledTableField style={{ width: "7%" }}>
          <AntDesign name="clockcircle" size={20} color="black" />
        </StyledTableField>
        <StyledTableField style={{ width: "7%" }}>
          <AntDesign name="checkcircle" size={20} color="black" />
        </StyledTableField>
      </StyledTableHeader>
      {areasOfImportance.length > 0 ? (
        areasOfImportance.map((v) => {
          return <HomeActionItem key={v.key} aoi={v.AOI} data={data} />;
        })
      ) : (
        <Text>No AOI's</Text>
      )}
      {loading && <ActivityIndicator size="large" color="#000000" />}
    </StyledHome>
  );
};

export default Home;
