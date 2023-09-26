import "react-native-get-random-values";
import React, { useEffect } from "react";
import { Text, SafeAreaView } from "react-native";
import styled from "styled-components/native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { getAreasOfImportance } from "../../utils/AreasOfImportanceHandler";
import AreasOfImportanceAdd from "./AreasOfImportanceAdd";
import { alertAtom } from "../../recoil/alertAtom";
import { areasOfImportanceAtom } from "../../recoil/areasOfImportanceAtom";
import { useSetRecoilState, useRecoilState } from "recoil";
import AreasOfImportanceItem from "./AreasOfImportanceItem";

const AOIListItems = styled.View`
  display: flex;
  flex-direction: column;
  height: 70%;
`;

const AreasOfImportance = () => {
  const [data, setData] = useRecoilState(areasOfImportanceAtom);
  const setAlert = useSetRecoilState(alertAtom);

  useEffect(() => {
    getAreasOfImportance(setAlert, setData);
  }, []);

  return (
    <SafeAreaView>
      <AreasOfImportanceAdd />

      <AOIListItems>
        {data.length > 0 ? (
          <DraggableFlatList
            data={data}
            onDragEnd={({ data }) => setData(data)}
            keyExtractor={(item) => item.key}
            renderItem={AreasOfImportanceItem}
          />
        ) : (
          <Text>No AOL's in your list</Text>
        )}
      </AOIListItems>
    </SafeAreaView>
  );
};

export default AreasOfImportance;
