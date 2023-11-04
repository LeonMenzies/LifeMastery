import { FC } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

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
  const styles = styling(colors, navigator.page == pageKey, width);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setNavigator({
          page: pageKey,
          show: false,
        });
      }}
    >
      <View style={styles.innerContainer}>
        <View style={styles.icon}>
          <Icon name={icon} size={18} color={colors.primary} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styling = (colors: ThemeT, active: boolean, width: number) =>
  StyleSheet.create({
    container: {
      width: width,
    },
    innerContainer: {
      alignItems: "center",
      backgroundColor: active ? colors.secondary : colors.background,
      flexDirection: "row",
      borderRadius: 5,
      padding: 8,
      margin: 5,
      gap: 10,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 18,
    },
    icon: {
      width: 20,
      alignItems: "center",
    },
  });
