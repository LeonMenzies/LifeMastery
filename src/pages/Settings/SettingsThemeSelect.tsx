import { View, Text, StyleSheet, Switch } from "react-native";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import { FC, useEffect } from "react";

import { themeAtom, lightTheme, darkTheme } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";
import { settingsAtom } from "~recoil/settingsAtom";
import { getSettings, saveSettings } from "~utils/SettingsHandler";

export const SettingsThemeSelect: FC<any> = () => {
  const setTheme = useSetRecoilState(themeAtom);
  const [settings, setSettings] = useRecoilState(settingsAtom);

  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  const onChange = (b: boolean) => {
    const newSettings = { ...settings, lightMode: b };
    setSettings(newSettings);
    saveSettings(newSettings);
    b ? setTheme(lightTheme) : setTheme(darkTheme);
  };

  useEffect(() => {
    getSettings(setSettings);
  }, [settings]);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>{settings.lightMode ? "Light Mode" : "Dark Mode"}</Text>

        <View style={styles.switch}>
          <Switch
            trackColor={{ false: colors.secondary, true: colors.secondary }}
            thumbColor={colors.primary}
            ios_backgroundColor="#3e3e3e"
            onValueChange={onChange}
            value={settings.lightMode}
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
      width: "80%",
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
