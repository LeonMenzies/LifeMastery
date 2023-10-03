import { StyleSheet, SafeAreaView, View, Text } from "react-native";

import { colors } from "~styles/GlobalStyles";

export const HomeHeader = ({ focus }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.focusContainer}>
        <Text style={styles.focusText}>Todays Focus: {focus}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
