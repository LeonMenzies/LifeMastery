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
import ActionsListItem from "./ActionsListItem";

const StyledActionsList = styled.SafeAreaView``;

const ActionsListItems = styled.View`
  display: flex;
  flex-direction: column;
  height: 70%;
`;

const ActionsList = () => {
  const [data, setData] = useRecoilState(actionsAtom);
  const [loading, setLoading] = useState(true);
  const setAlert = useSetRecoilState(alertAtom);

  useEffect(() => {
    getActions(setAlert, setData, setLoading);
  }, []);

  return (
    <StyledActionsList>
      <ActionsListAdd />

      <ActionsListItems>
        {data.length > 0 ? (
          <DraggableFlatList
            data={data}
            onDragEnd={({ data }) => setData(data)}
            keyExtractor={(item) => item.key}
            renderItem={ActionsListItem}
          />
        ) : (
          <Text>No Actions in your list</Text>
        )}
      </ActionsListItems>
      {loading && <ActivityIndicator size="large" color="#000000" />}
    </StyledActionsList>
  );
};

export default ActionsList;
