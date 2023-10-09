import { FC, useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { TextInput as Input } from "react-native";
import { useRecoilValue } from "recoil";
import { QUARTER_TIME } from "~utils/Constants";
import { Picker } from "react-native-wheel-pick";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

type TextInputT = {
  title: string;
  setTimeEstimate: any;
};

export const TimePicker: FC<TextInputT> = ({ title, setTimeEstimate }) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    setTimeEstimate(Number(hours) + minutes);
  }, [hours, minutes]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          style={{ backgroundColor: colors.background, width: 70, height: 150, top: -40 }}
          selectedValue={hours}
          pickerData={minutes === 0 ? [...Array(10).keys()] : [...Array(9).keys()]}
          onValueChange={setHours}
        />
        <Text style={styles.timeTitle}>hours</Text>
        <Picker
          style={{ backgroundColor: colors.background, width: 100, height: 150, top: -40 }}
          selectedValue={minutes}
          pickerData={QUARTER_TIME}
          onValueChange={setMinutes}
        />
        <Text style={styles.timeTitle}>min</Text>
      </View>
    </View>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      width: 300,
      padding: 7,
      zIndex: 0,
    },
    pickerContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    timeTitle: {
      top: -7,
      fontSize: 20,
      color: colors.grey,
    },
    title: {
      fontSize: 15,
      color: colors.grey,
      zIndex: 10,
    },
    input: {
      fontSize: 17,
      padding: 5,
      borderBottomColor: "black",
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
  });
