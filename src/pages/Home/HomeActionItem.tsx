import { Text, StyleSheet, SafeAreaView, View } from "react-native";
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
    <View style={styles.container}>
      <View style={styles.actionContainer}>
        <CheckBoxInput
          onPress={() =>
            updateAction(setAlert, setActions, { ...action, isCompleted: !action.isCompleted })
          }
          completed={action.isCompleted}
          color={color}
        />
        <Text>{action.action}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text>{action.priority}</Text>
        <Text>{action.timeEstimate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
});
