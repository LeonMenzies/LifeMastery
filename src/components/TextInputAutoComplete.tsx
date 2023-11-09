import { FC, useEffect, useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { TextInput as Input } from "react-native";
import { useRecoilValue } from "recoil";

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
  const [autoComplete, setAutoComplete] = useState([]);

  const onChange = (text: string) => {
    onChangeText(text);

    if (text.length > 2) {
      setVisible(true);

      const minimumScore = 4;

      const sortedStrings = autoCompleteText
        .map((str) => ({
          string: str,
          score: levenshteinDistance(text, str),
        }))
        .sort((a, b) => a.score - b.score);

      const filteredStrings = sortedStrings.filter((item) => item.score < minimumScore);
      const topSuggestions = filteredStrings.slice(0, 3).map((item) => item.string);

      setAutoComplete(topSuggestions);
    } else {
      setVisible(false);
    }
  };

  function levenshteinDistance(str1: string, str2: string): number {
    const m = str1.length;
    const n = str2.length;

    // Create a 2D array to store the distances
    const dp: number[][] = [];
    for (let i = 0; i <= m; i++) {
      dp[i] = new Array(n + 1).fill(0);
    }

    // Initialize the first row and column
    for (let i = 0; i <= m; i++) {
      dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
      dp[0][j] = j;
    }

    // Fill in the rest of the array
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
    return dp[m][n];
  }

  const onItemPress = (text: string): void => {
    onChangeText(text);
    setVisible(false);
  };

  const renderItem = (text: string, index: number, value: string) => {
    const characters = text.split("").slice(0, 30);

    return (
      <TouchableOpacity key={index} style={styles.itemButton} onPress={() => onItemPress(text)}>
        <View style={styles.itemButtonText}>
          {characters.map((char: string, index: number) => (
            <Text style={{ color: value[index] == char ? colors.textPrimary : colors.grey }}>
              {char}
            </Text>
          ))}
        </View>
        <View style={styles.divider} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.inputContainer}>
        <Input
          style={styles.input}
          onChangeText={onChange}
          value={value}
          placeholder={placeholder}
          keyboardType={keyboardType}
          maxLength={maxLength}
          editable={disabled}
          selectTextOnFocus={disabled}
          onBlur={() => setVisible(false)}
        />
        {visible && (
          <View style={styles.dropDownContainer}>
            {autoComplete.map((text: string, index: number) => renderItem(text, index, value))}
          </View>
        )}
      </View>
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
      color: colors.textPrimary,
    },
    dropDownContainer: {
      paddingVertical: 6,
    },
    inputContainer: {
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      borderRadius: 8,
      marginHorizontal: 8,
      padding: 12,
    },
    itemButton: {
      width: "100%",
      zIndex: 20,
    },
    itemButtonText: {
      flexDirection: "row",
      paddingVertical: 4,
    },
    divider: {
      borderBottomColor: colors.grey,
      borderBottomWidth: StyleSheet.hairlineWidth,
      paddingVertical: 2,
    },
  });
