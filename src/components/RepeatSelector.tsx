import { FC } from "react";
import { Text, StyleSheet, View, TouchableHighlight } from "react-native";
import { useRecoilValue } from "recoil";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";
import { RepearSelectorButton } from "./RepearSelectorButton";

type RepeatSelectorT = {
  title: string;
  repeatDays: {
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
  };
  onChange: any;
};

export const RepeatSelector: FC<RepeatSelectorT> = ({ title, repeatDays, onChange }) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handlePress = (day: string) => {
    onChange({ ...repeatDays, [day.toLowerCase()]: !repeatDays[day.toLowerCase()] });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.buttonContainer}>
        {weekDays.map((day: string, index: number) => (
          <RepearSelectorButton key={day} text={day} borders={index !== 0} selected={repeatDays[day.toLowerCase()]} onPress={() => handlePress(day)} />
        ))}
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
    buttonContainer: {
      borderRadius: 5,
      borderColor: colors.primary,
      borderWidth: 2,
      flexDirection: "row",
    },
    title: {
      fontSize: 15,
      color: colors.grey,
      paddingVertical: 8,
    },
  });
