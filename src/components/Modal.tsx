import {
  View,
  Modal as ModalReact,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { useRecoilValue } from "recoil";
import { FC, useEffect, useRef } from "react";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";
import { IconButton } from "./IconButton";

type ModalT = {
  visible: boolean;
  onRequestClose: any;
  children: any;
};

export const Modal: FC<ModalT> = ({ visible, onRequestClose, children }) => {
  const colors = useRecoilValue(themeAtom);
  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;

  const animatedHeight = useRef(new Animated.Value(0)).current;
  const styles = styling(colors, height, width, animatedHeight);

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: visible ? height - 150 : 0,
      duration: 400,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [visible]);

  if (!visible) {
    return <></>;
  }
  const backgroundColor = animatedHeight.interpolate({
    inputRange: [0, height - 150],
    outputRange: ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0,0.5)"], // Change these values to your desired colors
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <TouchableOpacity style={styles.clickAway} activeOpacity={1} onPressOut={onRequestClose} />
      <Animated.View
        style={[
          styles.modal,
          {
            transform: [
              {
                translateY: animatedHeight.interpolate({
                  inputRange: [0, height - 150],
                  outputRange: [height, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.closeContainer}>
          <IconButton color={colors.primary} icon={"close"} onPress={onRequestClose} />
        </View>
        {children}
      </Animated.View>
    </Animated.View>
  );
};

const styling = (colors: ThemeT, height: number, width: number, animatedHeight: Animated.Value) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      height: height,
      width: width,
    },
    clickAway: {
      height: 150,
    },
    modal: {
      alignItems: "center",
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: colors.background,
      height: height,
      zIndex: 20,
    },
    closeContainer: {
      width: "100%",
      alignItems: "flex-end",
      paddingBottom: 10,
    },
    closeButton: {
      borderRadius: 50,
      padding: 10,
    },
  });
