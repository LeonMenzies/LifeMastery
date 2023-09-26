import { SafeAreaView, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import styled from "styled-components/native";
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
  },
  input: {
    margin: 10,
    padding: 5,
    height: 40,
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 22,
    textAlign: "center",
  },
});

export default Home;
