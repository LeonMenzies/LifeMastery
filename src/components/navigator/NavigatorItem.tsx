import { FC } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { StyleSheet, View, Dimensions, TouchableOpacity } from "react-native";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";
import { NavigatorHeader } from "~components/navigator/NavigatorHeader";
import { navigatorAtom } from "~recoil/navigatorAtom";

type NavigatorItemT = {
  children: React.ReactNode;
  title: string;
  rightButtonIcon?: string;
  rightButton?: () => void;
};

export const NavigatorItem: FC<NavigatorItemT> = ({
  children,
  rightButton,
  rightButtonIcon,
  title,
}) => {
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const colors = useRecoilValue(themeAtom);
  const [navigator, setNavigator] = useRecoilState(navigatorAtom);
  const styles = styling(colors, width, height);

  return (
    <View style={styles.container}>
      {navigator.show && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() =>
            setNavigator({
              page: navigator.page,
              show: false,
            })
          }
        />
      )}
      <NavigatorHeader rightButton={rightButton} rightButtonIcon={rightButtonIcon} title={title} />
      {children}
    </View>
  );
};

const styling = (colors: ThemeT, width: number, height: number) =>
  StyleSheet.create({
    container: {
      height: "100%",
      width: width,
      backgroundColor: colors.background,
    },
    overlay: {
      position: "absolute",
      zIndex: 20,
      height: height,
      width: width,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
  });
