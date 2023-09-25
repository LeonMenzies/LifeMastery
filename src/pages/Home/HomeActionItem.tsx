import { View, Text, StyleSheet, Button, SafeAreaView } from "react-native";
import styled from "styled-components/native";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { deleteAreaOfImportance } from "../../utils/AreasOfImportanceHandler";
import { alertAtom } from "../../recoil/alertAtom";
import { useSetRecoilState } from "recoil";
import { areasOfImportanceAtom } from "../../recoil/areasOfImportanceAtom";
import { useState, useEffect } from "react";
import { completeAction } from "../../utils/ActionsHandler";
import { actionsAtom } from "../../recoil/actionsAtom";
import CheckBoxInput from "../../components/CheckBoxInput";
import { actionItemT } from "../../types/Types";

type HomeActionItemT = {
  action: actionItemT;
  color: string;
};

const HomeActionItem = ({ action, color }: HomeActionItemT) => {
  const [sortedData, setSortedData] = useState([]);
  const setAlert = useSetRecoilState(alertAtom);
  const [loading, setLoading] = useState(true);
  const setData = useSetRecoilState(actionsAtom);

  return (
    <SafeAreaView style={styles.container}>
      <CheckBoxInput
        onPress={() => completeAction(setAlert, setData, setLoading, action.key)}
        completed={action.isCompleted}
        color={color}
      />
      <Text style={{ width: "70%" }}>{action.action}</Text>
      <Text style={{ width: "10%" }}>{action.priority}</Text>
      <Text style={{ width: "10%" }}>{action.timeEstimate}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 2,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default HomeActionItem;
