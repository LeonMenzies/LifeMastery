import { View, Text, StyleSheet, Switch } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { themeAtom, lightTheme, darkTheme } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";
import { useEffect, useState } from "react";

export const SettingsThemeSelect = () => {
  const setTheme = useSetRecoilState(themeAtom);
  const [light, setLight] = useState(true);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  const onChange = (b: boolean) => {
    setLight(b);
    light ? setTheme(lightTheme) : setTheme(darkTheme);
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>{light ? "Dark Mode" : "Light Mode"}</Text>

        <View style={styles.switch}>
          <Switch
            trackColor={{ false: colors.secondary, true: colors.secondary }}
            thumbColor={colors.primary}
            ios_backgroundColor="#3e3e3e"
            onValueChange={onChange}
            value={light}
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
