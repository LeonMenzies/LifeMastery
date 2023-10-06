import { Text, StyleSheet, SafeAreaView } from "react-native";
import { useSetRecoilState } from "recoil";

import { alertAtom } from "~recoil/alertAtom";
import { updateAction } from "~utils/ActionsHandler";
import { CheckBoxInput } from "~components/CheckBoxInput";
import { actionItemT } from "~types/Types";

type HomeActionItemT = {
  action: actionItemT;
  color: string;
  setActions: any;
};

export const HomeActionItem = ({ action, color, setActions }: HomeActionItemT) => {
  const setAlert = useSetRecoilState(alertAtom);

  return (
    <SafeAreaView style={styles.container}>
      <CheckBoxInput
        onPress={() =>
          updateAction(setAlert, setActions, { ...action, isCompleted: !action.isCompleted })
        }
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
