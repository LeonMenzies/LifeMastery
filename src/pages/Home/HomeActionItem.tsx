import { Text, StyleSheet, SafeAreaView } from "react-native";
import { useSetRecoilState } from "recoil";

import { alertAtom } from "~recoil/alertAtom";
import { completeAction } from "~utils/ActionsHandler";
import { actionsAtom } from "~recoil/actionsAtom";
import { CheckBoxInput } from "~components/CheckBoxInput";
import { actionItemT } from "~types/Types";

type HomeActionItemT = {
  action: actionItemT;
  color: string;
};

export const HomeActionItem = ({ action, color }: HomeActionItemT) => {
  const setAlert = useSetRecoilState(alertAtom);
  const setData = useSetRecoilState(actionsAtom);

  return (
    <SafeAreaView style={styles.container}>
      <CheckBoxInput
        onPress={() => completeAction(setAlert, setData, action.key)}
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
