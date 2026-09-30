import { FC, JSX, useEffect } from "react";
import { TouchableWithoutFeedback, Keyboard, StyleSheet, View, Dimensions, SafeAreaView } from "react-native";
import Toast from "react-native-root-toast";

import { useThemeStore } from "~store/themeStore";
import { ThemeT } from "~types/Types";
import { NavigatorMenu } from "~components/navigator/NavigatorMenu";
import { IconNameT } from "~components/IconButton";
import { Plan } from "~pages/Plan/Plan";
import { Home } from "~pages/Home/Home";
import { ActionsList } from "~pages/ActionsList/ActionsList";
import { Settings } from "~pages/Settings/Settings";
import { useAlertStore, defaultAlert } from "~store/alertStore";
import { useNavigatorStore } from "~store/navigatorStore";

type NavigatorT = {};

export type PageItems = {
  [key: string]: PageItem;
};

export type PageItem = {
  title: string;
  icon: IconNameT;
  component: JSX.Element;
};

export const Navigator: FC<NavigatorT> = () => {
  const height = Dimensions.get("window").height;

  const colors = useThemeStore((s) => s.theme);
  const styles = styling(colors, height);
  const alert = useAlertStore((s) => s.alert);
  const setAlert = useAlertStore((s) => s.setAlert);
  const navigator = useNavigatorStore((s) => s.navigator);

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;
    if (alert.message !== "") {
      timerId = setTimeout(() => setAlert(defaultAlert), 2000);
    }
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [alert]);

  const alertColors = {
    info: "#37a2ff",
    error: "#db2f00",
    success: "#1cbe00",
    warning: "#ff8c00",
  };

  const getAlertColor = () => {
    return alertColors[alert.type] || "#000";
  };

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
        <Toast visible={alert.message !== ""} position={Toast.positions.TOP} shadow={true} animation={true} hideOnPress={true} backgroundColor={getAlertColor()} duration={Toast.durations.LONG}>
          {alert.message}
        </Toast>
        <View style={styles.component}>{pageMap[navigator].component}</View>
        <NavigatorMenu pageMap={pageMap} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styling = (colors: ThemeT, height: number) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    component: {
      height: height - 100,
      backgroundColor: colors.background,
      paddingTop: 50,
    },
  });
