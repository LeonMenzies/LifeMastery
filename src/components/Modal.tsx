import React, { FC, useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions } from "react-native";
import { useRecoilValue } from "recoil";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";
import { IconButton } from "~components/IconButton";

type ModalT = {
  visible: boolean;
  onRequestClose: any;
  children: any;
};

export const Modal: FC<ModalT> = ({ visible, onRequestClose, children }) => {
  const colors = useRecoilValue(themeAtom);
  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;
  const [modalHeight, setModalHeight] = useState(0);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const styles = styling(colors, height, width, modalHeight);
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
        toValue: height,
        duration: 400,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start(() => {
        setShow(false);
      });
    }
  }, [visible]);

  const backgroundColor = animatedHeight.interpolate({
    inputRange: [0, height],
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
          <View
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              setModalHeight(height);
            }}
            style={styles.innerContainer}
          >
            {children}
          </View>
        </Animated.View>
      </Animated.View>
    );
};

const styling = (colors: ThemeT, height: number, width: number, modalHeight: number) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      width: width,
      height: height,
    },
    innerContainer: {
      width: width,
      alignItems: "center",
    },
    clickAway: {
      height: height - modalHeight - 200,
    },
    modal: {
      alignItems: "center",
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: colors.background,
      zIndex: 20,
      height: height - modalHeight + 600,
    },
    closeContainer: {
      width: "100%",
      alignItems: "flex-end",
    },
    closeButton: {
      borderRadius: 50,
      padding: 10,
    },
  });
