import { FC, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
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
  const styles = styling(colors);

  const options = {
    weekday: "long" as const,
    month: "short" as const,
    day: "numeric" as const,
  };

  const dateFormatter = new Intl.DateTimeFormat("en-US", options);
  const formattedDate = dateFormatter.format(new Date());

  return (
    <View style={styles.container}>
      <Text>{formattedDate}</Text>
      <Text style={styles.focusText}>Key Focus: {focus}</Text>
      {percent > 0 && <HomeProgressBar percent={percent} />}
    </View>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.primary,
      width: "80%",
      alignItems: "center",
      paddingTop: 8,
      margin: 10,
      marginTop: 60,
    },
    focusText: {
      fontSize: 17,
      padding: 10,
    },
  });
