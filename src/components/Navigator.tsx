import "react-native-gesture-handler";
import Toast from "react-native-root-toast";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useRecoilValue, useRecoilState } from "recoil";
import { Button } from "react-native";
import { v4 as uuidv4 } from "uuid";

import { themeAtom } from "~recoil/themeAtom";
import { alertAtom } from "~recoil/alertAtom";
import { actionsShowAddEditAtom } from "~recoil/actionsShowAddEditAtom";
import { Home } from "~pages/Home/Home";
import { ActionsList } from "~pages/ActionsList/ActionsList";
import { AreasOfImportance } from "~pages/AreasOfImportance/AreasOfImportance";
import { Settings } from "~pages/Settings/Settings";
import { Plan } from "~pages/Plan/Plan";
import { actionItemT } from "~types/Types";
import { ActionAddEdit } from "~components/ActionAddEdit";

export const Navigator = () => {
  const Drawer = createDrawerNavigator();
  const theme = useRecoilValue(themeAtom);
  const [alert, setAlert] = useRecoilState(alertAtom);
  const [modalVisible, setModalVisible] = useRecoilState(actionsShowAddEditAtom);
  const [date, setDate] = useState(new Date().toLocaleString());
  const key = uuidv4();

  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Use 24-hour format
  };

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

  useEffect(() => {
    const intervalId = setInterval(() => setDate(new Date().toLocaleString()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            backgroundColor: theme.background,
            width: 200,
          },
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.secondary,
          drawerActiveTintColor: theme.secondary,
        }}
      >
        <Drawer.Screen
          name={"Plan"}
          options={{
            drawerLabel: "Plan",
            headerRight: () => (
              <Button
                title="Add"
                onPress={() =>
                  setModalVisible({
                    show: true as boolean,
                    action: {
                      key: key,
                      action: "",
                      isCompleted: false,
                      timeEstimate: 0,
                      priority: 0,
                      areaOfImportance: "",
                      dateAdded: date,
                    } as actionItemT,
                  })
                }
              />
            ),
          }}
          component={Plan}
        />
        <Drawer.Screen
          name={"Home"}
          options={{
            drawerLabel: "Home",
            title: `${date}`,
          }}
          component={Home}
        />
        <Drawer.Screen
          name="Actions List"
          options={{
            drawerLabel: "Actions List",
            headerRight: () => (
              <Button
                title="Add"
                onPress={() =>
                  setModalVisible({
                    show: true as boolean,
                    action: {
                      key: key,
                      action: "",
                      isCompleted: false,
                      timeEstimate: 0,
                      priority: 0,
                      areaOfImportance: "",
                      dateAdded: date,
                    } as actionItemT,
                  })
                }
              />
            ),
          }}
          component={ActionsList}
        />
        <Drawer.Screen
          name="Areas Of Importance"
          options={{ drawerLabel: "AOI" }}
          component={AreasOfImportance}
        />
        <Drawer.Screen name="Settings" options={{ drawerLabel: "Settings" }} component={Settings} />
      </Drawer.Navigator>
      <ActionAddEdit modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </NavigationContainer>
  );
};
