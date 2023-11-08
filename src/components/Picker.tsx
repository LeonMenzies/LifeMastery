import { FC, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRecoilValue } from "recoil";
import { Picker as InputPicker } from "@react-native-picker/picker";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

type optionT = {
  label: string;
  value: string;
};

type PickerT = {
  title: string;
  value: string;
  onChange: (e: string) => void;
  options: optionT[];
};

export const Picker: FC<PickerT> = ({ title, value, onChange, options }) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <InputPicker selectedValue={value} onValueChange={onChange} itemStyle={{ height: 150 }}>
        {options.map((option: optionT) => (
          <InputPicker.Item label={option.label} value={option.value} color={colors.textPrimary} />
        ))}
      </InputPicker>
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
