import { StyleSheet, View, DimensionValue } from "react-native";
import { useRecoilValue } from "recoil";
import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

type HomeProgressBarT = {
  percent: number;
};

export const HomeProgressBar = ({ percent }: HomeProgressBarT) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors, `${percent}%`);

  return (
    <View style={styles.container}>
      <View style={styles.percent} />
    </View>
  );
};

const styling = (colors: ThemeT, percent: DimensionValue) =>
  StyleSheet.create({
    container: {
      height: 6,
      width: "100%",
    },
    percent: {
      width: percent,
      height: "100%",
      backgroundColor: colors.secondary,
    },
  });
