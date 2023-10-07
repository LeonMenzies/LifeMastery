import "react-native-gesture-handler";
import Toast from "react-native-root-toast";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { useRecoilValue, useRecoilState } from "recoil";
import { Button, StyleSheet, Text, View } from "react-native";
import { v4 as uuidv4 } from "uuid";
import Icon from "react-native-vector-icons/FontAwesome";

import { themeAtom } from "~recoil/themeAtom";
import { alertAtom } from "~recoil/alertAtom";
import { actionsShowAddEditAtom } from "~recoil/actionsShowAddEditAtom";
import { Home } from "~pages/Home/Home";
import { ActionsList } from "~pages/ActionsList/ActionsList";
import { AreasOfImportance } from "~pages/AreasOfImportance/AreasOfImportance";
import { Settings } from "~pages/Settings/Settings";
import { Plan } from "~pages/Plan/Plan";
import { ThemeT, actionItemT } from "~types/Types";
import { ActionAddEdit } from "~components/ActionAddEdit";

export const Navigator = () => {
  const Drawer = createDrawerNavigator();
  const theme = useRecoilValue(themeAtom);
  const [alert, setAlert] = useRecoilState(alertAtom);
  const [modalVisible, setModalVisible] = useRecoilState(actionsShowAddEditAtom);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [date, setDate] = useState(new Date().toLocaleString());
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);
  const key = uuidv4();

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

  const CustomDrawerContent = (props: any) => {
    return (
      <DrawerContentScrollView {...props} style={styles.container}>
        <DrawerItemList {...props} />
        <DrawerItem
          label={() => <Icon name="gear" size={22} color={colors.black} />}
          style={styles.settingsButton}
          onPress={() => setSettingsVisible(true)}
        />
      </DrawerContentScrollView>
    );
  };

  const CustomLabel = (label: string, icon: string) => {
    return (
      <View style={styles.label}>
        <Icon name={icon} size={22} color={colors.black} />
        <Text>{label}</Text>
      </View>
    );
  };

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
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name={"Plan"}
          options={{
            drawerLabel: () => CustomLabel("Plan", "home"),
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
            drawerLabel: () => CustomLabel("Home", "home"),
            title: `${date}`,
          }}
          component={Home}
        />
        <Drawer.Screen
          name="Actions List"
          options={{
            drawerLabel: () => CustomLabel("Actions List", "home"),
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
          options={{ drawerLabel: () => CustomLabel("AOI", "home") }}
          component={AreasOfImportance}
        />
      </Drawer.Navigator>
      <ActionAddEdit modalVisible={modalVisible} setModalVisible={setModalVisible} />
      <Settings modalVisible={settingsVisible} setModalVisible={setSettingsVisible} />
    </NavigationContainer>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      alignContent: "space-between",
    },
    settingsButton: {
      bottom: 0,
    },
    label: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
  });
