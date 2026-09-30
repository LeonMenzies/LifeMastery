import { Text, StyleSheet, View, Dimensions } from "react-native";
import { FC } from "react";

import { useAlertStore } from "~store/alertStore";
import { addAction, updateAction } from "~utils/ActionsHandler";
import { CheckBoxInput } from "~components/CheckBoxInput";
import { ActionItemT, ThemeT } from "~types/Types";
import { useThemeStore } from "~store/themeStore";
import { convertTime } from "~utils/Helpers";
import { usePlanStore } from "~store/planStore";

type HomeActionItemT = {
  action: ActionItemT;
  color: string;
  setActions: any;
};

export const HomeActionItem: FC<HomeActionItemT> = ({ action, color, setActions }) => {
  const setAlert = useAlertStore((s) => s.setAlert);
  const windowWidth = Dimensions.get("window").width;
  const colors = useThemeStore((s) => s.theme);
  const styles = styling(colors, windowWidth, action.isCompleted);
  const plan = usePlanStore((s) => s.plan);

  const callback = () => {
    if (action.repeat) {
      addAction(setAlert, null, action.action, action.timeEstimate, action.areaOfImportance, action.repeat, false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.actionContainer}>
        <CheckBoxInput
          onPress={() => {
            if (action.repeat && action.isCompleted) {
              return;
            }

            updateAction(setAlert, setActions, { ...action, isCompleted: !action.isCompleted }, callback);
          }}
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
