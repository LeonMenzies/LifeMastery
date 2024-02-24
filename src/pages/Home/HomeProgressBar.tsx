import { FC, useEffect, useRef } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { useRecoilValue } from "recoil";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

type HomeProgressBarT = {
  percent: number;
};

export const HomeProgressBar: FC<HomeProgressBarT> = ({ percent }) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  // Create an animated value
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Update the animated value when the percent prop changes
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: percent,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  // Calculate the width as a percentage
  const width = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.percent, { width }]} />
    </View>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      height: 6,
      width: "100%",
    },
    percent: {
      height: "100%",
      backgroundColor: colors.secondary,
    },
  });
