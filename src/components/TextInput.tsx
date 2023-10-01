import { FC } from "react";
import { Text, StyleSheet, View } from "react-native";
import { TextInput as Input } from "react-native";
import { colors } from "~styles/GlobalStyles";

type TextInputT = {
  title: string;
  value: string;
  onChangeText: any;
  placeholder: string;
  maxLength: number;
  keyboardType: any;
  disabled?: boolean;
};

export const TextInput: FC<TextInputT> = ({
  title,
  value,
  onChangeText,
  placeholder,
  maxLength,
  keyboardType,
  disabled,
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
        editable={disabled}
        selectTextOnFocus={disabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    padding: 7,
    zIndex: 2,
  },
  title: {
    fontSize: 15,
    color: colors.darkGrey,
  },
  input: {
    fontSize: 17,
    padding: 5,
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
