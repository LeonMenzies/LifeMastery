import { Text, StyleSheet, View, Dimensions } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { FC } from "react";

import { alertAtom } from "~recoil/alertAtom";
import { updateAction } from "~utils/ActionsHandler";
import { CheckBoxInput } from "~components/CheckBoxInput";
import { ActionItemT, ThemeT } from "~types/Types";
import { themeAtom } from "~recoil/themeAtom";

type HomeActionItemT = {
  action: ActionItemT;
  color: string;
  setActions: any;
  dayComplete: boolean;
};

export const HomeActionItem: FC<HomeActionItemT> = ({ action, color, setActions, dayComplete }) => {
  const setAlert = useSetRecoilState(alertAtom);
  const windowWidth = Dimensions.get("window").width;
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors, windowWidth);

  return (
    <View style={styles.container}>
      <View style={styles.actionContainer}>
        <CheckBoxInput
          onPress={() =>
            updateAction(setAlert, setActions, { ...action, isCompleted: !action.isCompleted })
          }
          completed={action.isCompleted}
          color={color}
          disabled={dayComplete}
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

const styling = (colors: ThemeT, windowWidth: number) =>
  StyleSheet.create({
    container: {
      padding: 2,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: windowWidth - 50,
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
