import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { themeAtom } from "../recoil/themeAtom";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import { alertAtom } from "../recoil/alertAtom";
import { actionsShowAddEditAtom } from "../recoil/actionsShowAddEditAtom";
import Toast from "react-native-root-toast";
import { Button } from "react-native";
import { useEffect } from "react";

import Home from "../pages/Home/Home";
import ActionsList from "../pages/ActionsList/ActionsList";
import Quantities from "../pages/AreasOfImportance/AreasOfImportance";
import Settings from "../pages/Settings/Settings";
import Plan from "../pages/Plan/Plan";

const App = () => {
  const Drawer = createDrawerNavigator();
  const theme = useRecoilValue(themeAtom);
  const [alert, setAlert] = useRecoilState(alertAtom);
  const setActionsShowAddEdit = useSetRecoilState(actionsShowAddEditAtom);

  useEffect(() => {
    if (alert !== "") {
      let toast = Toast.show(alert, {
        duration: Toast.durations.LONG,
      });

      setTimeout(function hideToast() {
        Toast.hide(toast);
        setAlert("");
      }, 2000);
    }
  }, [alert]);

  const date = new Date().toISOString().split("T")[0];

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
          name={"Home"}
          options={{
            drawerLabel: "Home",
            title: `Daily Planner. Date: ${date}`,
          }}
          component={Home}
        />
        <Drawer.Screen
          name={"Plan"}
          options={{
            drawerLabel: "Plan",
          }}
          component={Plan}
        />
        <Drawer.Screen
          name="Actions List"
          options={{
            drawerLabel: "Actions List",
            headerRight: () => <Button title="Add" onPress={() => setActionsShowAddEdit(true)} />,
          }}
          component={ActionsList}
        />
        <Drawer.Screen
          name="Areas Of Importance"
          options={{ drawerLabel: "AOI" }}
          component={Quantities}
        />
        <Drawer.Screen name="Settings" options={{ drawerLabel: "Settings" }} component={Settings} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
