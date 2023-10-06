import { StyleSheet, SafeAreaView, View, Text } from "react-native";
import { useRecoilValue } from "recoil";
import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

export const HomeHeader = ({ focus }) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.focusContainer}>
        <Text style={styles.focusText}>Todays Focus: {focus}</Text>
      </View>
    </SafeAreaView>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      margin: 10,
      backgroundColor: colors.lightGrey,
      borderColor: colors.darkGrey,
      borderWidth: 1,
      borderRadius: 10,
    },
    focusContainer: {
      padding: 10,
    },
    focusText: {
      fontSize: 17,
    },
  });
