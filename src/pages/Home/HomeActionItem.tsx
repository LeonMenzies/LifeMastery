import { Text, StyleSheet, View, Dimensions } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { FC } from "react";

import { alertAtom } from "~recoil/alertAtom";
import { updateAction } from "~utils/ActionsHandler";
import { CheckBoxInput } from "~components/CheckBoxInput";
import { ActionItemT, ThemeT } from "~types/Types";
import { themeAtom } from "~recoil/themeAtom";
import { convertTime } from "~utils/Helpers";
import { planAtom } from "~recoil/planAtom";

type HomeActionItemT = {
  action: ActionItemT;
  color: string;
  setActions: any;
};

export const HomeActionItem: FC<HomeActionItemT> = ({ action, color, setActions }) => {
  const setAlert = useSetRecoilState(alertAtom);
  const windowWidth = Dimensions.get("window").width;
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors, windowWidth, action.isCompleted);
  const plan = useRecoilValue(planAtom);

  return (
    <View style={styles.container}>
      <View style={styles.actionContainer}>
        <CheckBoxInput
          onPress={() =>
            updateAction(setAlert, setActions, { ...action, isCompleted: !action.isCompleted })
          }
          completed={action.isCompleted}
          color={color}
          disabled={plan.complete}
        />
        <Text style={styles.actionText}>{action.action}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{action.priority}</Text>
        <Text style={styles.infoText}>{convertTime(action.timeEstimate)}</Text>
      </View>
    </View>
  );
};

const styling = (colors: ThemeT, windowWidth: number, complete: boolean) =>
  StyleSheet.create({
    container: {
      padding: 2,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: windowWidth - 50,
    },
    actionText: {
      fontSize: 17,
      color: complete ? colors.grey : colors.textPrimary,
    },
    actionContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    infoContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: 70,
    },
    infoText: {
      color: colors.textPrimary,
    },
  });
