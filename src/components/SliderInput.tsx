import { FC } from "react";
import { Text, StyleSheet, View } from "react-native";
import { TextInput as Input } from "react-native";
import Slider, { SliderValue } from "react-native-a11y-slider";
import { useRecoilValue } from "recoil";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

type SliderInputT = {
  title: string;
  min: number;
  max: number;
  markerColor: string;
  onChange: (values: SliderValue[]) => void;
  values: any;
  showLabel: boolean;
  increment: number;
  disabled?: boolean;
};

export const SliderInput: FC<SliderInputT> = ({
  title,
  min,
  max,
  markerColor,
  onChange,
  values,
  showLabel,
  increment,
  disabled,
}) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.title}>{values[0]}</Text>
      </View>

      <Slider
        min={min}
        max={max}
        increment={increment}
        markerColor={markerColor}
        onChange={onChange}
        values={values}
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
    },
    input: {
      fontSize: 17,
      padding: 5,
      color: colors.textPrimary,
      borderBottomColor: colors.textPrimary,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
  });
