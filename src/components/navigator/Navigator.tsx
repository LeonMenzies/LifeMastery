import { FC, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { TouchableWithoutFeedback, Keyboard, StyleSheet, View, Dimensions, SafeAreaView } from "react-native";
import Toast from "react-native-root-toast";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";
import { NavigatorMenu } from "~components/navigator/NavigatorMenu";
import { Plan } from "~pages/Plan/Plan";
import { Home } from "~pages/Home/Home";
import { ActionsList } from "~pages/ActionsList/ActionsList";
import { Settings } from "~pages/Settings/Settings";
import { alertAtom, defaultAlert } from "~recoil/alertAtom";
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
    let timerId: NodeJS.Timeout;
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
    info: "#37a2ffd1",
    error: "#e43100c9",
    success: "#1cbe00c8",
    warning: "#ff8c00cb",
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
