import { FC } from "react";
import { Text, StyleSheet, View } from "react-native";
import { TextInput as Input } from "react-native";
import { useRecoilValue } from "recoil";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

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
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

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

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      padding: 10,
      zIndex: 2,
      width: "100%",
    },
    title: {
      fontSize: 15,
      color: colors.grey,
      paddingVertical: 8,
    },
    input: {
      fontSize: 20,
      padding: 12,
      color: colors.textPrimary,
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      borderRadius: 8,
      marginHorizontal: 8,
    },
  });
