import "react-native-gesture-handler";
import Toast from "react-native-root-toast";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { DrawerItem, DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
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

  useEffect(() => {
    const intervalId = setInterval(() => setDate(new Date().toLocaleString()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const CustomDrawerContent = (props: any) => {
    return (
      <View style={styles.container}>
        <View>
          <DrawerItemList {...props} />
        </View>
        <DrawerItem
          label={() => customLabel("Settings", "gear")}
          onPress={() => setSettingsVisible(true)}
        />
      </View>
    );
  };

  const customLabel = (label: string, icon: string) => {
    return (
      <View style={styles.label}>
        <Icon name={icon} size={17} color={colors.primary} />
        <Text style={styles.labelText}>{label}</Text>
      </View>
    );
  };

  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            backgroundColor: colors.background,
            width: 220,
          },
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.secondary,
          drawerActiveTintColor: colors.secondary,
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name={"Home"}
          options={{
            drawerLabel: () => customLabel("Home", "home"),
            title: `${date}`,
          }}
          component={Home}
        />
        <Drawer.Screen
          name={"Plan"}
          options={{
            drawerLabel: () => customLabel("Plan", "pencil"),
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
          name="Actions List"
          options={{
            drawerLabel: () => customLabel("Actions List", "list"),
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
          options={{ drawerLabel: () => customLabel("Areas of Importance", "flag") }}
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
      marginBottom: 30,
      marginTop: 60,
      flex: 1,
      justifyContent: "space-between",
    },
    label: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    labelText: {
      fontSize: 15,
    },
  });
