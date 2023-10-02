import "react-native-get-random-values";
import React, { useEffect, useState } from "react";
import { SafeAreaView, Text } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";

import { getActions } from "~utils/ActionsHandler";
import { alertAtom } from "~recoil/alertAtom";
import { actionsAtom } from "~recoil/actionsAtom";
import { useSetRecoilState, useRecoilState } from "recoil";
import { ActionsListItem } from "~pages/ActionsList/ActionsListItem";
import { ActionAddEdit } from "~components/ActionAddEdit";
import { actionsShowAddEditAtom } from "~recoil/actionsShowAddEditAtom";

export const ActionsList = () => {
  // const [data, setData] = useRecoilState(actionsAtom);
  const setAlert = useSetRecoilState(alertAtom);
  const [modalVisible, setModalVisible] = useRecoilState(actionsShowAddEditAtom);
  const [actions, setActions] = useState([]);

  useEffect(() => {
    getActions(setAlert, setActions);
  }, []);

  const renderItem = ({ item, drag, isActive }) => {
    return <ActionsListItem item={item} drag={drag} isActive={isActive} setActions={setActions} />;
  };

  return (
    <SafeAreaView>
      <ActionAddEdit modalVisible={modalVisible} setModalVisible={setModalVisible} />

      {actions.length > 0 ? (
        <DraggableFlatList
          data={actions}
          onDragEnd={({ data }) => setActions(data)}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
        />
      ) : (
        <Text>No Actions in your list</Text>
      )}
    </SafeAreaView>
  );
};
