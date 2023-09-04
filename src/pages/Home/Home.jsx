import { View, Text, SafeAreaView, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import styled from "styled-components/native";
import HomeHeader from "./HomeHeader";
import { storeData, getData } from "../../utils/Storage";

const StyledHome = styled.SafeAreaView`
  background-color: red;
  height: 100%;
`;

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData("actions-list").then((d) => {
      if (d !== null) {
        setData(JSON.parse(d));
        console.log("Retrieved data:", JSON.parse(d));
      } else {
        console.log("no data");
      }
      setLoading(false);
    });
  }, []);

  return (
    <StyledHome>
      <HomeHeader />
      {loading && <ActivityIndicator size="large" color="#00ff00" />}
      <View>{/* <Text>{data}</Text> */}</View>
    </StyledHome>
  );
};

export default Home;
