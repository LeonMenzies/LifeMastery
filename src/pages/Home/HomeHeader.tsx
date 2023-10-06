import { StyleSheet, SafeAreaView, View, Text } from "react-native";
import { useRecoilValue } from "recoil";
import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";
import { HomeProgressBar } from "~pages/Home/HomeProgressBar";

type HomeHeaderT = {
  focus: string;
  total: number;
  complete: number;
};

export const HomeHeader = ({ focus, total, complete }: HomeHeaderT) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.focusText}>Todays Focus: {focus}</Text>
      {complete > 0 && <HomeProgressBar total={total} complete={complete} />}
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
