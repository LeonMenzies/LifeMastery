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

    if (text.length > 1) {
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
        <View style={styles.itemButton}>
          <Text style={styles.itemButtonText}>{sliceString(text)}</Text>
        </View>
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
      paddingVertical: 8,
    },
    input: {
      fontSize: 20,
      padding: 12,
      color: colors.textPrimary,
      backgroundColor: "rgba(255, 255, 255, 0.03)",
      borderRadius: 8,
      marginHorizontal: 8,
    },
    dropDownContainer: {
      margin: 7,
      top: 80,
      position: "absolute",
      backgroundColor: colors.background,
      width: "100%",
      zIndex: 20,
    },
    dropDown: {
      zIndex: 20,
    },
    itemButton: {
      width: "100%",
      zIndex: 20,
    },
    itemButtonText: {
      padding: 4,
      color: colors.textPrimary,
      fontSize: 20,
      zIndex: 20,
    },
  });
