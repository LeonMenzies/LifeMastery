import { StyleSheet, SafeAreaView, Text } from "react-native";

export const HomeHeader = ({ focus }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Todays Focus: {focus}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    backgroundColor: colors.lightGrey,
    borderColor: colors.darkGrey,
    borderWidth: 1,
    borderRadius: 10,
  },
});
