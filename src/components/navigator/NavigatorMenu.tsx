import { FC, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Animated, Easing, StyleSheet, Dimensions, View } from "react-native";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";
import { navigatorAtom } from "~recoil/navigatorAtom";
import { NavigatorMenuItem } from "~components/navigator/NavigatorMenuItem";
import { PageItems, PageItem } from "~components/navigator/Navigator";
import { IconButton } from "~components/IconButton";
import { Settings } from "~pages/Settings/Settings";

type NavigatorMenuT = {
  pageMap: PageItems;
};

export const NavigatorMenu: FC<NavigatorMenuT> = ({ pageMap }) => {
  const navigator = useRecoilValue(navigatorAtom);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors, navigator.show);
  const width = Dimensions.get("window").width / 1.8;
  const [settingsVisible, setSettingsVisible] = useState(false);

  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: navigator.show ? width : 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [navigator.show]);

  return (
    <Animated.View style={[styles.container, { width: animatedWidth }]}>
      <View>
        {Object.entries(pageMap).map(([key, value]: [string, PageItem]) => {
          return (
            <NavigatorMenuItem
              key={key}
              title={value.title}
              icon={value.icon}
              pageKey={key}
              width={width}
            />
          );
        })}
      </View>
      <View style={styles.settingsButtonContainer}>
        <IconButton icon={"gear"} color={colors.primary} onPress={() => setSettingsVisible(true)} />
      </View>
      <Settings modalVisible={settingsVisible} setModalVisible={setSettingsVisible} />
    </Animated.View>
  );
};

const styling = (colors: ThemeT, show: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      justifyContent: "space-between",
    },
    settingsButtonContainer: {
      padding: 8,
      margin: 5,
    },
  });
