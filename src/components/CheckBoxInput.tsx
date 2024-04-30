import { TouchableOpacity, StyleSheet, GestureResponderEvent, Animated } from "react-native";
import { useRecoilValue } from "recoil";
import { FC, useRef, useEffect } from "react";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

type CheckBoxInputT = {
  onPress: (event: GestureResponderEvent) => void;
  completed: boolean;
  color: string;
  disabled: boolean;
};

export const CheckBoxInput: FC<CheckBoxInputT> = ({ onPress, color, completed, disabled }) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(color, completed, colors);

  const scaleValue = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: completed ? 1.2 : 0.6,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  }, [completed]);

  const buttonStyle = {
    transform: [{ scale: scaleValue }],
  };

  return (
    <Animated.View style={buttonStyle}>
      <TouchableOpacity style={styles.button} onPress={disabled ? null : onPress} />
    </Animated.View>
  );
};

const styling = (color: string, completed: boolean, colors: ThemeT) =>
  StyleSheet.create({
    button: {
      borderRadius: 100,
      backgroundColor: completed ? color : null,
      borderColor: "grey",
      borderWidth: 1,
      width: 24,
      height: 24,
      margin: 8,
    },
  });
