import { FC, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { SafeAreaView, StyleSheet } from "react-native";
import Toast from "react-native-root-toast";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";
import { NavigatorMenu } from "~components/navigator/NavigatorMenu";

import { Plan } from "~pages/Plan/Plan";
import { Home } from "~pages/Home/Home";
import { ActionsList } from "~pages/ActionsList/ActionsList";
import { AreasOfImportance } from "~pages/AreasOfImportance/AreasOfImportance";
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
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);
  const [alert, setAlert] = useRecoilState(alertAtom);
  const navigator = useRecoilValue(navigatorAtom);

  useEffect(() => {
    console.log(alert);

    if (alert !== "") {
      let toast = Toast.show(alert, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
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
    plan: {
      title: "Plan",
      icon: "home",
      component: <Plan />,
    },
    home: {
      title: "Home",
      icon: "list",
      component: <Home />,
    },
    actionsList: {
      title: "Actions List",
      icon: "clock-o",
      component: <ActionsList />,
    },
    areasOfImportance: {
      title: "Areas Of Importance",
      icon: "male",
      component: <AreasOfImportance />,
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigatorMenu pageMap={pageMap} />
      {pageMap[navigator.page].component}
    </SafeAreaView>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      flex: 1,
      backgroundColor: colors.background,
    },
  });
