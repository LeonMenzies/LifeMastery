import { View, Text, StyleSheet, Switch } from "react-native";
import { useRecoilValue, useRecoilState } from "recoil";
import { FC } from "react";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";
import { settingsAtom } from "~recoil/settingsAtom";

export const SettingsCompleteSelect: FC<any> = () => {
  const [timePercent, setTimePercent] = useRecoilState(settingsAtom);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  const onChange = (b: boolean) => {
    setTimePercent({ ...timePercent, timePercent: b });
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>
          {timePercent.timePercent ? "Time Complete" : "Tasks Complete"}
        </Text>

        <View style={styles.switch}>
          <Switch
            trackColor={{ false: colors.secondary, true: colors.secondary }}
            thumbColor={colors.primary}
            ios_backgroundColor="#3e3e3e"
            onValueChange={onChange}
            value={timePercent.timePercent}
          />
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      width: 300,
    },
    innerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 3,
    },
    title: {
      fontSize: 17,
      color: colors.textPrimary,
    },
    switch: {
      padding: 7,
    },
    divider: {
      borderBottomColor: colors.textPrimary,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
  });
