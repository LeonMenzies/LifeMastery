import { FC } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { useRecoilValue } from "recoil";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";
import { HomeProgressBar } from "~pages/Home/HomeProgressBar";

type HomeHeaderT = {
  focus: string;
  percent: number;
};

export const HomeHeader: FC<HomeHeaderT> = ({ focus, percent }) => {
  const colors = useRecoilValue(themeAtom);
  const windowWidth = Dimensions.get("window").width;
  const styles = styling(colors, windowWidth);

  const options = {
    weekday: "long" as const,
    month: "short" as const,
    day: "numeric" as const,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.focusText}>Key Focus: {focus}</Text>
      {percent > 0 && <HomeProgressBar percent={percent} />}
    </View>
  );
};

const styling = (colors: ThemeT, windowWidth: number) =>
  StyleSheet.create({
    container: {
      width: windowWidth - 50,
      alignItems: "center",
      paddingTop: 8,
      margin: 10,
      marginTop: 60,
    },
    focusText: {
      fontSize: 18,
      padding: 10,
      color: colors.textPrimary,
    },
  });
