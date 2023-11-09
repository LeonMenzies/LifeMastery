import { FC } from "react";
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
      <InputPicker
        selectedValue={value}
        selectionColor={"rgba(0, 0, 0, 0.1)"}
        onValueChange={onChange}
        itemStyle={{ height: 150 }}
      >
        {options.map((option: optionT, index: number) => (
          <InputPicker.Item
            key={index}
            label={option.label}
            value={option.value}
            color={colors.textPrimary}
          />
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
    title: {
      fontSize: 15,
      color: colors.grey,
    },
  });
