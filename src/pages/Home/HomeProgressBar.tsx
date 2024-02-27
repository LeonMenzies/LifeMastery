import { FC, useEffect, useRef } from "react";
import { StyleSheet, View, Animated, Text } from "react-native";
import { useRecoilValue } from "recoil";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

type HomeProgressBarT = {
  percent: number;
};

export const HomeProgressBar: FC<HomeProgressBarT> = ({ percent }) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors, percent == 100);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: percent,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  const width = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.percent, { width }]}>
        <Text style={styles.text}>{`${percent == 100 ? "Congratulations!" : ""} ${Math.round(percent)}%`}</Text>
      </Animated.View>
    </View>
  );
};

const styling = (colors: ThemeT, complete: boolean) =>
  StyleSheet.create({
    container: {
      height: 20,
      width: "100%",
      backgroundColor: colors.secondary,
      borderRadius: 10,
      overflow: "hidden",
    },
    percent: {
      height: "100%",
      backgroundColor: complete ? colors.success : colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      color: "white",
      fontWeight: "bold",
    },
  });
