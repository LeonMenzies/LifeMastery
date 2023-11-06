import Icon from "react-native-vector-icons/SimpleLineIcons";
import { FC, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback } from "react-native";
import { useRecoilValue } from "recoil";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

type optionT = {
  label: string;
  value: string;
};

type SelectT = {
  title: string;
  value: string;
  onChange: (e: string) => void;
  options: optionT[];
  placeholder?: string;
};

export const Select: FC<SelectT> = ({
  title,
  value,
  onChange,
  options,
  placeholder = "Select an option...",
}) => {
  const [visible, setVisible] = useState(false);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  const toggleDropdown = () => {
    setVisible(!visible);
  };

  const onItemPress = (item: string): void => {
    onChange(item);
    setVisible(false);
  };

  const renderItem = (item: optionT) => {
    return (
      <TouchableOpacity
        key={item.value}
        style={styles.itemButton}
        onPress={() => onItemPress(item.value)}
      >
        <Text style={styles.itemButtonText}>{item.label}</Text>
        <View style={styles.divider} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity style={styles.select} onPress={toggleDropdown}>
        {value === "" ? (
          <Text style={styles.selectedTextPlaceholder}>{placeholder}</Text>
        ) : (
          <Text style={styles.selectedText}>{value}</Text>
        )}
        {visible ? (
          <Icon name="arrow-down" color={colors.grey} />
        ) : (
          <Icon name="arrow-left" color={colors.grey} />
        )}
      </TouchableOpacity>
      {visible && (
        <View style={styles.dropDownContainer}>
          {options.map((option: optionT) => renderItem(option))}
        </View>
      )}
      {visible && (
        <TouchableWithoutFeedback onPress={toggleDropdown}>
          <View style={styles.outsideClick} />
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      width: "100%",
      padding: 10,
      zIndex: 3,
    },
    outsideClick: {
      position: "absolute",
      left: -100,
      top: -400,
      height: 1000,
      width: 500,
    },
    title: {
      fontSize: 15,
      color: colors.grey,
    },
    selectedText: {
      fontSize: 17,
      color: colors.textPrimary,
    },
    selectedTextPlaceholder: {
      fontSize: 17,
      color: colors.grey,
    },
    select: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      zIndex: 1,
      padding: 5,
      borderBottomColor: colors.textPrimary,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    buttonText: {
      textAlign: "center",
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
