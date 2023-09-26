import "react-native-get-random-values";

import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { getAreasOfImportance } from "../../utils/AreasOfImportanceHandler";
import AreasOfImportanceAdd from "./AreasOfImportanceAdd";
import { alertAtom } from "../../recoil/alertAtom";
import { areasOfImportanceAtom } from "../../recoil/areasOfImportanceAtom";
import { useSetRecoilState, useRecoilState } from "recoil";
import AreasOfImportanceItem from "./AreasOfImportanceItem";

const StyledAreasOfImportanceList = styled.SafeAreaView``;

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
    <StyledAreasOfImportanceList>
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
      {loading && <ActivityIndicator size="large" color="#000000" />}
    </StyledAreasOfImportanceList>
  );
};

export default AreasOfImportance;
