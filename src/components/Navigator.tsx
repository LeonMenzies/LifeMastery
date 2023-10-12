import "react-native-gesture-handler";
import Toast from "react-native-root-toast";
import { useEffect, useState, FC } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { DrawerItem, DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import { useRecoilValue, useRecoilState } from "recoil";
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
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
import { ThemeT, ActionItemT } from "~types/Types";
import { ActionAddEdit } from "~components/ActionAddEdit";
import { getDay } from "~utils/Helpers";

export const Navigator: FC<any> = () => {
  const Drawer = createDrawerNavigator();
  const [alert, setAlert] = useRecoilState(alertAtom);
  const [modalVisible, setModalVisible] = useRecoilState(actionsShowAddEditAtom);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);
  const key = uuidv4();
  const date = new Date();

  const options = {
    weekday: "long" as const,
    month: "short" as const,
    day: "numeric" as const,
  };

  const dateFormatter = new Intl.DateTimeFormat("en-US", options);
  const formattedDate = dateFormatter.format(date);

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

  const addButton = () => {
    return (
      <TouchableHighlight
        underlayColor={colors.primary}
        style={styles.addButton}
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
              dateAdded: date.toISOString().split("T")[0],
            } as ActionItemT,
          })
        }
      >
        <Icon name={"plus"} size={17} color={colors.textPrimary} />
      </TouchableHighlight>
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
            borderBottomWidth: 0,
          },
          headerTintColor: colors.primary,
          drawerActiveTintColor: colors.primary,
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name={"Home"}
          options={{
            drawerLabel: () => customLabel("Home", "home"),
            title: `${formattedDate}`,
            unmountOnBlur: true,
          }}
          component={Home}
        />
        <Drawer.Screen
          name={"Plan"}
          options={{
            drawerLabel: () => customLabel("Plan", "pencil"),
            unmountOnBlur: true,
            headerRight: addButton,
          }}
          component={Plan}
        />
        <Drawer.Screen
          name="Actions List"
          options={{
            drawerLabel: () => customLabel("Actions List", "list"),
            unmountOnBlur: true,
            headerRight: addButton,
          }}
          component={ActionsList}
        />
        <Drawer.Screen
          name="Areas Of Importance"
          options={{
            drawerLabel: () => customLabel("Areas of Importance", "flag"),
            unmountOnBlur: true,
          }}
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
      color: colors.textPrimary,
    },
    addButton: {
      padding: 15,
      borderRadius: 100,
    },
  });
