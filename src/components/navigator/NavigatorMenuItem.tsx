import { FC } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Icon from "@expo/vector-icons/SimpleLineIcons";

import { useThemeStore } from "~store/themeStore";
import { ThemeT } from "~types/Types";
import { IconNameT } from "~components/IconButton";
import { useNavigatorStore } from "~store/navigatorStore";

type NavigatorMenuItemT = {
  title: string;
  icon: IconNameT;
  pageKey: string;
  width: number;
};

export const NavigatorMenuItem: FC<NavigatorMenuItemT> = ({ title, icon, pageKey, width }) => {
  const navigator = useNavigatorStore((s) => s.navigator);
  const setNavigator = useNavigatorStore((s) => s.setNavigator);
  const colors = useThemeStore((s) => s.theme);
  const styles = styling(colors, width);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setNavigator(pageKey);
      }}
    >
      <Icon
        name={icon}
        size={24}
        color={navigator == pageKey ? colors.primary : colors.textPrimary}
      />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styling = (colors: ThemeT, width: number) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      width: width,
      borderRadius: 20,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 12,
    },
  });
