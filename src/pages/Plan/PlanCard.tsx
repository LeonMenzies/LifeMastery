import { SafeAreaView, StyleSheet, View, TouchableHighlight, Text } from "react-native";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import DraggableFlatList from "react-native-draggable-flatlist";

import { alertAtom } from "~recoil/alertAtom";
import { TextInput } from "~components/TextInput";
import { colors } from "~styles/GlobalStyles";
import { getPlan, savePlan, finalizePlan } from "~utils/PlanHandler";
import { PlanT, actionItemT } from "~types/Types";
import { getActions } from "~utils/ActionsHandler";
import { PlanActionsListItem } from "~pages/Plan/PlanActionsListItem";
import { Button } from "~components/Button";

type PlanCardT = {
  day: string;
  actions: actionItemT[];
  setActions: any;
  navigation: any;
};

export const PlanCard = ({ day, actions, setActions, navigation }: PlanCardT) => {
  const [data, setData] = useState<PlanT>({
    key: "",
    date: "",
    focus: "",
    finalized: false,
    actionKeys: [],
  });
  const setAlert = useSetRecoilState(alertAtom);
  const [text, setText] = useState("");

  useEffect(() => {
    getPlan(setAlert, setData, day);
  }, []);

  useEffect(() => {
    setText(data.focus);
  }, [data]);

  const updateFocus = (newFocus: string) => {
    setData((prevData) => ({
      ...prevData,
      focus: newFocus,
    }));
  };

  const addActionKey = (actionKey: string) => {
    setData((prevData) => ({
      ...prevData,
      actionKeys: [...prevData.actionKeys, actionKey],
    }));
  };

  const removeActionKey = (actionKey: string) => {
    setData((prevData) => ({
      ...prevData,
      actionKeys: prevData.actionKeys.filter((key: string) => key !== actionKey),
    }));
  };

  const handleSave = () => {
    savePlan(setAlert, data, day);
  };

  const handleFinalize = () => {
    if (!text) {
      setAlert("Focus is required");
      return;
    }

    if (data.actionKeys.length < 1) {
      setAlert("You must add at least one action to your plan");
      return;
    }

    finalizePlan(
      setAlert,
      { ...data, finalized: true, date: new Date().toISOString().split("T")[0] },
      () => navigation.navigate("Plan"),
      day
    );
  };

  const renderItem = ({ item, drag, isActive }) => {
    const isInPlan = data.actionKeys.some((actionKey: string) => actionKey === item.key);

    return (
      <PlanActionsListItem
        item={item}
        drag={drag}
        isActive={isActive}
        setActions={setActions}
        addAction={addActionKey}
        removeAction={removeActionKey}
        isInPlan={isInPlan}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.focusContainer}>
          <TextInput
            title={"Focus"}
            onChangeText={updateFocus}
            value={text}
            placeholder="Add focus..."
            keyboardType="default"
            maxLength={30}
          />
        </View>
        {actions.length > 0 ? (
          <DraggableFlatList
            style={styles.actionsList}
            data={actions}
            onDragEnd={({ data }) => setActions(data)}
            keyExtractor={(item) => item.key}
            renderItem={renderItem}
          />
        ) : (
          <Text>No Actions in your list</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={handleSave} />
        <Button title="Finalize" onPress={handleFinalize} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    alignContent: "space-between",
    height: "75%",
  },
  focusContainer: {
    padding: 10,
    margin: 10,
    backgroundColor: colors.lightGrey,
    borderColor: colors.darkGrey,
    borderWidth: 1,
    borderRadius: 10,
  },
  actionsList: {
    height: "85%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
