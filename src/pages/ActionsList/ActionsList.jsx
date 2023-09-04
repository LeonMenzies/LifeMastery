import "react-native-get-random-values";

import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Button,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import styled from "styled-components/native";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { storeData, getData } from "../../utils/Storage";
import ActionsListAdd from "./ActionsListAdd";

const StyledActionsList = styled.SafeAreaView`
  background-color: white;
  display: flex;
  flex-direction: column;
`;

const ActionsList = () => {
  const [text, setText] = useState("");
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

  const generateKey = () => {
    return data.length.toString();
  };

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={{ backgroundColor: isActive ? "red" : item.backgroundColor }}
        >
          <Text>{item.todo}</Text>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <StyledActionsList>
      <ActionsListAdd />

      {/* <DraggableFlatList
        data={data}
        onDragEnd={({ data }) => setData(data)}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
      /> */}
      {loading && <ActivityIndicator size="large" color="#00ff00" />}
    </StyledActionsList>
  );
};

export default ActionsList;
