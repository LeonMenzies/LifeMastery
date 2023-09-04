import "react-native-get-random-values";

import React, { useEffect, useState } from "react";
import { SafeAreaView, Button, TouchableOpacity, Text } from "react-native";
import styled from "styled-components/native";
import { storeData, getData } from "../../utils/Storage";
import TextInput from "../../components/TextInput";

const StyledActionsListAdd = styled.SafeAreaView`
  background-color: white;
`;

const ActionsListAdd = ({}) => {
  const [text, setText] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    getData("actions-list").then((d) => {
      if (d !== null) {
        setData(JSON.parse(d));
        console.log("Retrieved data:", JSON.parse(d));
      } else {
        console.log("no data");
      }
    });
  }, [data]);

  const handleAddTodo = () => {
    if (!text) return;

    const key = generateKey();

    const newItem = {
      key: key,
      todo: text,
      isCompleted: false,
    };

    storeData(JSON.stringify([newItem, ...data]), "actions-list");
    setData([newItem, ...data]);
    setText("");
  };

  const generateKey = () => {
    return data.length.toString();
  };

  return (
    <StyledActionsListAdd>
      {/* <TextInput
        title={"Action"}
        onChangeText={setText}
        value={text}
        placeholder="New Action..."
        keyboardType="default"
        maxLength={30}
      />
      <TextInput
        title={"Time estimate"}
        onChangeText={setText}
        value={text}
        placeholder="New Action..."
        keyboardType="default"
        maxLength={30}
      /> */}
      <Button title="Add" onPress={handleAddTodo} />
    </StyledActionsListAdd>
  );
};

export default ActionsListAdd;
