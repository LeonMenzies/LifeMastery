import { FC } from "react";
import { Text, StyleSheet, View } from "react-native";
import { TextInput as Input } from "react-native";

type TextInputT = {
  title: string;
  value: string;
  onChangeText: any;
  placeholder: string;
  maxLength: number;
  keyboardType: any;
};

const TextInput: FC<TextInputT> = ({
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
      <Input
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
    height: 30,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default TextInput;
