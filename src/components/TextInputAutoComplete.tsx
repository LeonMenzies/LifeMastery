import { FC, useEffect, useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { TextInput as Input } from "react-native";
import { useRecoilValue } from "recoil";
import { v4 as uuidv4 } from "uuid";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

type TextInputAutoCompleteT = {
  title: string;
  value: string;
  onChangeText: (e: string) => void;
  placeholder: string;
  maxLength: number;
  keyboardType: any;
  autoCompleteText: string[];
  disabled?: boolean;
};

export const TextInputAutoComplete: FC<TextInputAutoCompleteT> = ({
  title,
  value,
  onChangeText,
  placeholder,
  maxLength,
  keyboardType,
  disabled,
  autoCompleteText,
}) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);
  const [visible, setVisible] = useState(false);
  const [autoComplete, setAutoComplete] = useState(autoCompleteText);

  const onChange = (text: string) => {
    onChangeText(text);

    if (text.length > 1 && false) {
      setVisible(true);

      const sortedStrings = autoComplete
        .map((str) => ({
          string: str,
          score: calculateSimilarity(text, str),
        }))
        .sort((a, b) => b.score - a.score);

      setAutoComplete(sortedStrings.slice(0, 3).map((item) => item.string));
    } else {
      setVisible(false);
    }
  };

  const calculateSimilarity = (str1: string, str2: string) => {
    const lowerStr1 = str1.toLowerCase();
    const lowerStr2 = str2.toLowerCase();
    const length = lowerStr1.length < lowerStr2.length ? lowerStr1.length : lowerStr2.length;

    let matchingChars = 0;

    for (let i = 0; i < length; i++) {
      if (lowerStr2.includes(lowerStr1[i])) {
        matchingChars++;
      }
    }

    const similarity = (matchingChars / length) * 100;

    return similarity;
  };

  const onItemPress = (text: string): void => {
    onChangeText(text);
    setVisible(false);
  };

  const sliceString = (text: string) => {
    return text.length > 30 ? `${text.slice(0, 30)}...` : text;
  };

  const renderItem = (text: string) => {
    const uniqueKey = uuidv4();

    return (
      <TouchableOpacity key={uniqueKey} style={styles.itemButton} onPress={() => onItemPress(text)}>
        <Text style={styles.itemButtonText}>{sliceString(text)}</Text>
        <View style={styles.divider} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Input
        style={styles.input}
        onChangeText={onChange}
        value={value}
        placeholder={placeholder}
        keyboardType={keyboardType}
        maxLength={maxLength}
        editable={disabled}
        selectTextOnFocus={disabled}
      />
      {visible && (
        <View style={styles.dropDownContainer}>
          {autoComplete.map((text: string) => renderItem(text))}
        </View>
      )}
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
    },
    input: {
      fontSize: 17,
      padding: 5,
      color: colors.textPrimary,
      borderBottomColor: colors.textPrimary,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    dropDownContainer: {
      margin: 7,
      top: 50,
      position: "absolute",
      backgroundColor: colors.background,
      width: "100%",
      zIndex: 4,
    },
    dropDown: {
      zIndex: 2,
    },
    itemButton: {
      width: "100%",
    },
    itemButtonText: {
      padding: 4,
      color: colors.textPrimary,
    },
    divider: {
      borderBottomColor: colors.textPrimary,
      borderBottomWidth: StyleSheet.hairlineWidth,
      padding: 1,
    },
  });
