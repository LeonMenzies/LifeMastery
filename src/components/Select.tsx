import Icon from "react-native-vector-icons/AntDesign";
import { FC, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRecoilValue } from "recoil";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

type optionT = {
  label: string;
  value: string;
};

type PlanT = {
  title: string;
  value: string;
  onChange: Function;
  options: optionT[];
  placeholder?: string;
};

export const Select: FC<PlanT> = ({
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

  const onItemPress = (item): void => {
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
        {visible ? <Icon name="caretdown" /> : <Icon name="caretleft" />}
      </TouchableOpacity>
      {visible && (
        <View style={styles.dropDownContainer}>
          {options.map((option: optionT) => renderItem(option))}
        </View>
      )}
    </View>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      width: 300,
      padding: 7,
      zIndex: 3,
    },
    title: {
      fontSize: 15,
      color: colors.grey,
    },
    selectedText: {
      fontSize: 17,
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
      borderBottomColor: "black",
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    buttonText: {
      textAlign: "center",
    },
    dropDownContainer: {
      margin: 7,
      top: 50,
      position: "absolute",
      backgroundColor: colors.white,
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
    },
    divider: {
      borderBottomColor: "black",
      borderBottomWidth: StyleSheet.hairlineWidth,
      padding: 1,
    },
  });
