import { View, StyleSheet, Text } from "react-native";
import { useRecoilValue } from "recoil";
import { FC, useEffect, useState } from "react";

import { ThemeT } from "~types/Types";
import { themeAtom } from "~recoil/themeAtom";
import { SliderInput } from "~components/SliderInput";

type SettingsT = {
  title: string;
  onChange: (value: number) => void;
  value: number;
};

export const SettingsSliderItem: FC<SettingsT> = ({ title, onChange, value }) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);
  const [sliderValue, setSliderValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onChange(sliderValue);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [sliderValue]);

  return (
    <View style={styles.container}>
      <View style={styles.itemInnerContainer}>
        <Text style={styles.itemText}>{title}</Text>
        <View style={styles.sliderStyles}>
          <SliderInput title={"Hours"} min={1} max={24} increment={1} markerColor={colors.primary} onChange={setSliderValue} value={sliderValue} showLabel={false} />
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      width: "100%",
    },
    itemInnerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingLeft: 8,
      height: 60,
    },
    itemText: {
      fontSize: 17,
      color: colors.textPrimary,
    },
    sliderStyles: {
      width: "70%",
    },
    divider: {
      borderBottomColor: colors.textPrimary,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
  });
