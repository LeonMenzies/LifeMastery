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
    width: 300,
    padding: 10,
  },
  title: {
    fontSize: 15,
  },
  input: {
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default TextInputComponent;
