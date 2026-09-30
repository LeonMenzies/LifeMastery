import { FC } from "react";
import { StyleSheet, Dimensions, View } from "react-native";

import { useThemeStore } from "~store/themeStore";
import { ThemeT } from "~types/Types";
import { NavigatorMenuItem } from "~components/navigator/NavigatorMenuItem";
import { PageItems, PageItem } from "~components/navigator/Navigator";

type NavigatorMenuT = {
  pageMap: PageItems;
};

export const NavigatorMenu: FC<NavigatorMenuT> = ({ pageMap }) => {
  const colors = useThemeStore((s) => s.theme);
  const styles = styling(colors);
  const width = Dimensions.get("window").width / Object.keys(pageMap).length;

  return (
    <View style={styles.container}>
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
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      height: 100,
      flexDirection: "row",
      justifyContent: "space-evenly",
      backgroundColor: colors.background,
      alignItems: "center",
    },
  });
