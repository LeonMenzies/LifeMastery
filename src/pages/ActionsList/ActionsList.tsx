import "react-native-get-random-values";
import React, { useEffect } from "react";
import { SafeAreaView, Text } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";

import { getActions } from "~utils/ActionsHandler";
import { alertAtom } from "~recoil/alertAtom";
import { actionsAtom } from "~recoil/actionsAtom";
import { useSetRecoilState, useRecoilState } from "recoil";
import ActionsListItem from "~pages/ActionsList/ActionsListItem";
import ActionAddEdit from "~components/ActionAddEdit";
import { actionsShowAddEditAtom } from "~recoil/actionsShowAddEditAtom";

export const ActionsList = () => {
  const [data, setData] = useRecoilState(actionsAtom);
  const setAlert = useSetRecoilState(alertAtom);
  const [modalVisible, setModalVisible] = useRecoilState(actionsShowAddEditAtom);

  useEffect(() => {
    getActions(setAlert, setData);
  }, []);

  return (
    <SafeAreaView>
      <ActionAddEdit modalVisible={modalVisible} setModalVisible={setModalVisible} />

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
    </SafeAreaView>
  );
};
