import { View, Switch, StyleSheet, Text } from "react-native";
import { FC } from "react";

import { ThemeT } from "~types/Types";
import { useThemeStore } from "~store/themeStore";

type SettingsT = {
  title: string;
  callBack: (value: boolean) => void;
  value: boolean;
};

export const SettingsSelectItem: FC<SettingsT> = ({ title, callBack, value }) => {
  const colors = useThemeStore((s) => s.theme);
  const styles = styling(colors);

  return (
    <View style={styles.container}>
      <View style={styles.itemInnerContainer}>
        <Text style={styles.itemText}>{title}</Text>
        <Switch
          trackColor={{ false: colors.secondary, true: colors.secondary }}
          thumbColor={colors.primary}
          onValueChange={callBack}
          value={value}
        />
      </View>
      <View style={styles.divider} />
    </View>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      width: "100%",
    },
    itemInnerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 8,
      height: 60,
    },
    itemText: {
      fontSize: 17,
      color: colors.textPrimary,
    },
    divider: {
      borderBottomColor: colors.textPrimary,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
  });
