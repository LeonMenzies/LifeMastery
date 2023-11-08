import { FC, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { TouchableWithoutFeedback, Keyboard, StyleSheet, View, Dimensions } from "react-native";
import Toast from "react-native-root-toast";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";
import { NavigatorMenu } from "~components/navigator/NavigatorMenu";

import { Plan } from "~pages/Plan/Plan";
import { Home } from "~pages/Home/Home";
import { ActionsList } from "~pages/ActionsList/ActionsList";
import { Settings } from "~pages/Settings/Settings";
import { alertAtom } from "~recoil/alertAtom";
import { navigatorAtom } from "~recoil/navigatorAtom";

type NavigatorT = {};

export type PageItems = {
  [key: string]: PageItem;
};

export type PageItem = {
  title: string;
  icon: string;
  component: JSX.Element;
};

export const Navigator: FC<NavigatorT> = () => {
  const height = Dimensions.get("window").height;

  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors, height);
  const [alert, setAlert] = useRecoilState(alertAtom);
  const navigator = useRecoilValue(navigatorAtom);

  useEffect(() => {
    if (alert !== "") {
      let toast = Toast.show(alert, {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        hideOnPress: true,
        shadow: true,
        animation: true,
      });

      setTimeout(function hideToast() {
        Toast.hide(toast);
        setAlert("");
      }, 2000);
    }
  }, [alert]);

  const pageMap: PageItems = {
    home: {
      title: "Home",
      icon: "home",
      component: <Home />,
    },
    plan: {
      title: "Plan",
      icon: "note",
      component: <Plan />,
    },
    actionsList: {
      title: "Actions",
      icon: "list",
      component: <ActionsList />,
    },
    areasOfImportance: {
      title: "Settings",
      icon: "settings",
      component: <Settings />,
    },
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.component}>{pageMap[navigator].component}</View>
        <NavigatorMenu pageMap={pageMap} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styling = (colors: ThemeT, height: number) =>
  StyleSheet.create({
    container: {
      flexDirection: "column",
      flex: 1,
      backgroundColor: colors.background,
    },
    component: {
      height: height - 100,
    },
  });
