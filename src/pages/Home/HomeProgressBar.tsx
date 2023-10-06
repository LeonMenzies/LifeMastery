import { StyleSheet, SafeAreaView, View, Text, DimensionValue } from "react-native";
import { useRecoilValue } from "recoil";
import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

type HomeProgressBarT = {
  total: number;
  complete: number;
};

export const HomeProgressBar = ({ total, complete }: HomeProgressBarT) => {
  const colors = useRecoilValue(themeAtom);
  const percent = (complete / total) * 100;
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
