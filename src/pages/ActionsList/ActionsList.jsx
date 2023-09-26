import "react-native-get-random-values";

import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, ActivityIndicator, StyleSheet } from "react-native";
import styled from "styled-components/native";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { getActions } from "../../utils/ActionsHandler";
import { alertAtom } from "../../recoil/alertAtom";
import { actionsAtom } from "../../recoil/actionsAtom";
import { useSetRecoilState, useRecoilState } from "recoil";
import ActionsListItem from "./ActionsListItem";
import ActionAddEdit from "../../components/ActionAddEdit";
import { actionsShowAddEditAtom } from "../../recoil/actionsShowAddEditAtom";

const ActionsListItems = styled.View`
  display: flex;
  flex-direction: column;
  height: 70%;
`;

const ActionsList = () => {
  const [data, setData] = useRecoilState(actionsAtom);
  const setAlert = useSetRecoilState(alertAtom);
  const [modalVisible, setModalVisible] = useRecoilState(actionsShowAddEditAtom);

  useEffect(() => {
    getActions(setAlert, setData);
  }, []);

  return (
    <SafeAreaView>
      <ActionAddEdit modalVisible={modalVisible} setModalVisible={setModalVisible} />

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default ActionsList;
