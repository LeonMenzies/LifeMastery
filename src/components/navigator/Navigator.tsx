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
  const [page, setPage] = useState("home");
  const [alert, setAlert] = useRecoilState(alertAtom);

  useEffect(() => {
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
    home: {
      title: "Plan",
      icon: "home",
      component: <Plan />,
    },
    todo: {
      title: "Home",
      icon: "list",
      component: <Home />,
    },
    rest: {
      title: "ActionsList",
      icon: "clock-o",
      component: <ActionsList />,
    },
    workout: {
      title: "AreasOfImportance",
      icon: "male",
      component: <AreasOfImportance />,
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigatorMenu pageMap={pageMap} setPage={setPage} active={page} />
      {pageMap[page].component}
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
