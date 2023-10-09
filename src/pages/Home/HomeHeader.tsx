import { StyleSheet, SafeAreaView, View, Text } from "react-native";
import { useRecoilValue } from "recoil";
import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";
import { HomeProgressBar } from "~pages/Home/HomeProgressBar";

type HomeHeaderT = {
  focus: string;
  percent: number;
};

export const HomeHeader = ({ focus, percent }: HomeHeaderT) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.focusText}>Todays Focus: {focus}</Text>
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
      margin: 10,
    },
    focusText: {
      fontSize: 17,
      padding: 10,
    },
  });
