import { TextInput, Text, StyleSheet, View } from "react-native";

const TextInputComponent = ({
  title,
  value,
  onChangeText,
  placeholder,
  maxLength,
  keyboardType,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "powderblue",
  },
  title: {
    fontSize: 24,
  },
  input: {
    margin: 10,
    padding: 5,
    height: 40,
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 22,
    textAlign: "center",
  },
});

export default TextInputComponent;
