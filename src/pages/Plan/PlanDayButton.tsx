import { FC } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { useThemeStore } from "~store/themeStore";
import { ThemeT } from "~types/Types";

type PlanDayButtonT = {
  title: string;
  onPress: any;
  selected: boolean;
};

export const PlanDayButton: FC<PlanDayButtonT> = ({ title, onPress, selected }) => {
  const colors = useThemeStore((s) => s.theme);
  const styles = styling(selected, colors);

  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styling = (selected: boolean, colors: ThemeT) =>
  StyleSheet.create({
    button: {
      width: "50%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: selected ? colors.primary : null,
    },
    title: {
      padding: 5,
      fontSize: 17,
      color: selected ? colors.textSecondary : colors.textPrimary,
    },
  });
