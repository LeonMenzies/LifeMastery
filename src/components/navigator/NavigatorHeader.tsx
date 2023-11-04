import { FC } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { StyleSheet, View, Text } from "react-native";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";
import { navigatorAtom } from "~recoil/navigatorAtom";
import { IconButton } from "~components/IconButton";

type NavigatorHeaderT = {
  title: string;
  rightButtonIcon: string;
  rightButton: () => void;
};

export const NavigatorHeader: FC<NavigatorHeaderT> = ({ rightButton, rightButtonIcon, title }) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);
  const [show, setShow] = useRecoilState(navigatorAtom);

  return (
    <View style={styles.container}>
      <IconButton
        icon={show ? "align-left" : "align-justify"}
        onPress={() => setShow(true)}
        color={colors.primary}
      />

      <Text style={styles.title}>{title}</Text>

      <IconButton icon={rightButtonIcon} onPress={rightButton} color={colors.primary} />
    </View>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 8,
    },
    title: {
      fontSize: 18,
      color: colors.primary,
    },
  });
