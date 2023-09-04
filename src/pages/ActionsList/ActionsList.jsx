import "react-native-get-random-values";

import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { getActions } from "../../utils/ActionsHandler";
import ActionsListAdd from "./ActionsListAdd";
import { alertAtom } from "../../recoil/alertAtom";
import { actionsAtom } from "../../recoil/actionsAtom";
import { useSetRecoilState, useRecoilState } from "recoil";

const StyledActionsList = styled.SafeAreaView`
  background-color: white;
  display: flex;
  flex-direction: column;
`;

const ActionsList = () => {
  const [data, setData] = useRecoilState(actionsAtom);
  const [loading, setLoading] = useState(true);
  const setAlert = useSetRecoilState(alertAtom);

  useEffect(() => {
    getActions(setAlert, setData, setLoading);
  }, []);

  const renderItem = ({ item, drag, isActive }) => {
    console.log(item);
    return (
      <ScaleDecorator key={item.key}>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={{ backgroundColor: isActive ? "red" : item.backgroundColor }}
        >
          <Text>{item.action}</Text>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <StyledActionsList>
      <ActionsListAdd />

      {data.length > 0 ? (
        <DraggableFlatList
          data={data}
          onDragEnd={({ data }) => setData(data)}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
        />
      ) : (
        <Text>No Actions in your list</Text>
      )}
      {loading && <ActivityIndicator size="large" color="#000000" />}
    </StyledActionsList>
  );
};

export default ActionsList;
