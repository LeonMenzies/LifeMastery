import React, { FC, useEffect, useRef, useState } from "react";
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
  const styles = styling(colors, height, width);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 400,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start(() => {});
    } else {
      Animated.timing(animatedHeight, {
        toValue: height - 150,
        duration: 400,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start(() => {
        setShow(false);
      });
    }
  }, [visible]);

  const backgroundColor = animatedHeight.interpolate({
    inputRange: [0, height - 150],
    outputRange: ["rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0)"],
  });

  if (show)
    return (
      <Animated.View style={[styles.container, { backgroundColor: backgroundColor }]}>
        <TouchableOpacity style={styles.clickAway} activeOpacity={1} onPressOut={onRequestClose} />
        <Animated.View
          style={[
            styles.modal,
            {
              transform: [
                {
                  translateY: animatedHeight,
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

const styling = (colors: ThemeT, height: number, width: number) =>
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
      height: height - 150,
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
