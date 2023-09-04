import { View, Text, SafeAreaView, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import styled from "styled-components/native";
import HomeHeader from "./HomeHeader";
import { storeData, getData } from "../../utils/ActionsHandler";
import { useRecoilState, useSetRecoilState } from "recoil";
import { actionsAtom } from "../../recoil/actionsAtom";
import { alertAtom } from "../../recoil/alertAtom";
import { getActions } from "../../utils/ActionsHandler";

const StyledHome = styled.SafeAreaView`
  background-color: red;
  height: 100%;
`;

const Home = () => {
  const [data, setData] = useRecoilState(actionsAtom);
  const setAlert = useSetRecoilState(alertAtom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActions(setAlert, setData, setLoading);
  }, []);

  return (
    <StyledHome>
      <HomeHeader />
      {data.length > 0 ? (
        data.map((v) => {
          return <Text>{v.action}</Text>;
        })
      ) : (
        <Text>No Actions in your list</Text>
      )}
      {loading && <ActivityIndicator size="large" color="#000000" />}
    </StyledHome>
  );
};

export default Home;
