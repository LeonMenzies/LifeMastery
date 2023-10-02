import { SafeAreaView, StyleSheet, View, TouchableHighlight, Text } from "react-native";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import DraggableFlatList from "react-native-draggable-flatlist";

import { alertAtom } from "~recoil/alertAtom";
import { TextInput } from "~components/TextInput";
import { colors } from "~styles/GlobalStyles";
import { getTodaysPlan, getTomorrowsPlan } from "~utils/PlanHandler";
import { PlanT } from "~types/Types";
import { getActions } from "~utils/ActionsHandler";
import { PlanActionsListItem } from "~pages/Plan/PlanActionsListItem";

export const Plan = () => {
  const [data, setData] = useState<PlanT>({
    key: "",
    date: new Date(),
    focus: "",
    finalized: false,
    actionItems: [],
  });
  const setAlert = useSetRecoilState(alertAtom);
  const [text, setText] = useState("test action");
  const [today, setToday] = useState(true);
  const [actions, setActions] = useState([]);

  const styles = styling(today);

  useEffect(() => {
    getActions(setAlert, setActions, true);
  }, []);

  useEffect(() => {
    if (today) {
      getTodaysPlan(setAlert, setData);
    } else {
      getTomorrowsPlan(setAlert, setData);
    }
  }, [today]);

  useEffect(() => {
    setText(data.focus);
  }, [data]);

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <PlanActionsListItem item={item} drag={drag} isActive={isActive} setActions={setActions} />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableHighlight
          underlayColor={colors.darkGrey}
          style={styles.buttonToday}
          onPress={() => setToday(true)}
        >
          <Text style={styles.buttonText}>{"Today"}</Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={colors.darkGrey}
          style={styles.buttonTomorrow}
          onPress={() => setToday(false)}
        >
          <Text style={styles.buttonText}>{"Tomorrow"}</Text>
        </TouchableHighlight>
      </View>
      <View style={styles.planContainer}>
        <TextInput
          title={"Focus"}
          onChangeText={setText}
          value={text}
          placeholder="Add value..."
          keyboardType="default"
          maxLength={30}
        />
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
      </View>
    </SafeAreaView>
  );
};

const styling = (today: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      height: "100%",
      alignItems: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      width: "100%",
    },
    buttonToday: {
      backgroundColor: today ? colors.white : colors.lightGrey,
      alignItems: "center",
      justifyContent: "center",
      width: "50%",
      height: 30,
    },
    buttonTomorrow: {
      backgroundColor: today ? colors.lightGrey : colors.white,
      alignItems: "center",
      justifyContent: "center",
      width: "50%",
      height: 30,
    },
    buttonText: {
      fontSize: 15,
    },
    planContainer: {
      padding: 20,
    },
  });
