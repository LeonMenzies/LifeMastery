import { FC } from "react";
import { Text, StyleSheet, View, Switch } from "react-native";
import { useRecoilValue } from "recoil";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

type RepeatInputT = {
  title: string;
  value: boolean;
  onValueChange: any;
};

export const RepeatInput: FC<RepeatInputT> = ({ title, value, onValueChange }) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Switch trackColor={{ false: colors.secondary, true: colors.secondary }} thumbColor={colors.primary} onValueChange={onValueChange} value={value} />
    </View>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      padding: 10,
      zIndex: 2,
      width: "100%",
    },
    title: {
      fontSize: 15,
      color: colors.grey,
      paddingVertical: 8,
    },
    input: {
      fontSize: 20,
      padding: 12,
      color: colors.textPrimary,
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      borderRadius: 8,
      marginHorizontal: 8,
    },
  });
