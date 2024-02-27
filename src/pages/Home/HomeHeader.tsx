import { FC } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { useRecoilValue } from "recoil";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";
import { HomeProgressBar } from "~pages/Home/HomeProgressBar";
import { convertTime } from "~utils/Helpers";

type HomeHeaderT = {
  focus: string;
  percent: number;
  totalTime: number;
};

export const HomeHeader: FC<HomeHeaderT> = ({ focus, percent, totalTime }) => {
  const colors = useRecoilValue(themeAtom);
  const windowWidth = Dimensions.get("window").width;
  const styles = styling(colors, windowWidth);
  const date = new Date();

  const options = {
    weekday: "long" as const,
    month: "short" as const,
    day: "numeric" as const,
  };
  const formattedDate = date.toLocaleDateString("en-US", options);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.focusText}>Key Focus: {focus}</Text>
        <Text style={styles.smallText}>Total Time: {convertTime(totalTime)}</Text>
        <Text style={styles.smallText}>{formattedDate}</Text>
      </View>
      <HomeProgressBar percent={percent} />
    </View>
  );
};

const styling = (colors: ThemeT, windowWidth: number) =>
  StyleSheet.create({
    container: {
      width: windowWidth - 50,
      alignItems: "center",
      margin: 10,
    },
    innerContainer: {
      alignItems: "center",
      padding: 8,
    },
    focusText: {
      fontSize: 24,
      padding: 10,
      fontWeight: "bold",
      color: colors.textPrimary,
    },
    smallText: {
      color: colors.textPrimary,
    },
  });
