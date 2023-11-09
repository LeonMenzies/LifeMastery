import { FC } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/SimpleLineIcons";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";
import { navigatorAtom } from "~recoil/navigatorAtom";

type NavigatorMenuItemT = {
  title: string;
  icon: string;
  pageKey: string;
  width: number;
};

export const NavigatorMenuItem: FC<NavigatorMenuItemT> = ({ title, icon, pageKey, width }) => {
  const [navigator, setNavigator] = useRecoilState(navigatorAtom);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors, width);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setNavigator(pageKey);
      }}
    >
      <View style={styles.innerContainer}>
        <View style={styles.icon}>
          <Icon
            name={icon}
            size={24}
            color={navigator == pageKey ? colors.primary : colors.textPrimary}
          />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styling = (colors: ThemeT, width: number) =>
  StyleSheet.create({
    container: {
      width: width,
    },
    innerContainer: {
      alignItems: "center",
      flexDirection: "column",
      backgroundColor: colors.background,
      borderRadius: 15,
      padding: 4,
      margin: 8,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 12,
    },
    icon: {
      alignItems: "center",
    },
  });
