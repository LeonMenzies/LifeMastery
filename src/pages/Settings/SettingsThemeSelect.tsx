import { View, Text, StyleSheet, Switch } from "react-native";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import { FC } from "react";

import { themeAtom, lightTheme, darkTheme } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";
import { settingsAtom } from "~recoil/settingsAtom";

export const SettingsThemeSelect: FC<any> = () => {
  const setTheme = useSetRecoilState(themeAtom);
  const [light, setLight] = useRecoilState(settingsAtom);

  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  const onChange = (b: boolean) => {
    setLight({ ...light, lightMode: b });
    light.lightMode ? setTheme(darkTheme) : setTheme(lightTheme);
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>{light.lightMode ? "Light Mode" : "Dark Mode"}</Text>

        <View style={styles.switch}>
          <Switch
            trackColor={{ false: colors.secondary, true: colors.secondary }}
            thumbColor={colors.primary}
            ios_backgroundColor="#3e3e3e"
            onValueChange={onChange}
            value={light.lightMode}
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
    },
    switch: {
      padding: 7,
    },
    divider: {
      borderBottomColor: "black",
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
  });
