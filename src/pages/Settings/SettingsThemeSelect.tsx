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

  useEffect(() => {
    light ? setTheme(lightTheme) : setTheme(darkTheme);
  }, [light]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{light ? "Light Mode" : "Dark Mode"}</Text>

      <Switch
        trackColor={{ false: colors.secondary, true: colors.secondary }}
        thumbColor={colors.primary}
        ios_backgroundColor="#3e3e3e"
        onValueChange={setLight}
        value={light}
      />
    </View>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
    },
    title: {},
  });
