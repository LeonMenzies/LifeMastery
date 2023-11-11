import { FC } from "react";
import { Text, StyleSheet, View } from "react-native";
import Slider, { SliderValue } from "react-native-a11y-slider";
import { useRecoilValue } from "recoil";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

type SliderInputT = {
  title: string;
  min: number;
  max: number;
  markerColor: string;
  onChange: (value: number) => void;
  value: number;
  showLabel: boolean;
  increment: number;
};

export const SliderInput: FC<SliderInputT> = ({
  title,
  min,
  max,
  markerColor,
  onChange,
  value,
  showLabel,
  increment,
}) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  const generateNumbers = (): number[] => {
    return Array.from(
      { length: Math.floor((max - min) / increment) + 1 },
      (_, index) => min + index * increment
    );
  };

  const setValue = (values: SliderValue[]) => {
    let value = Number(values[0]);
    onChange(
      generateNumbers().reduce((closest, current) =>
        Math.abs(current - value) < Math.abs(closest - value) ? current : closest
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.title}>{value}</Text>
      </View>

      <Slider
        min={min}
        max={max}
        markerColor={markerColor}
        onChange={setValue}
        values={[value]}
        showLabel={showLabel}
        selectedTrackStyle={{ borderBlockColor: colors.primary }}
      />
    </View>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      width: "100%",
      padding: 10,
      zIndex: 2,
    },
    title: {
      fontSize: 15,
      color: colors.grey,
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 8,
    },
    input: {
      fontSize: 17,
      padding: 5,
      color: colors.textPrimary,
      borderBottomColor: colors.textPrimary,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
  });
