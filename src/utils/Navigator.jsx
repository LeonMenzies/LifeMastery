import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { themeAtom } from "../recoil/themeAtom";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import { colors } from "../styles/GlobalStyles";
import { ThemeProvider, Button, createTheme } from "@rneui/themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { alertAtom } from "../recoil/alertAtom";
import Toast from "react-native-root-toast";

import Home from "../pages/Home/Home";
import ActionsList from "../pages/ActionsList/ActionsList";
import Quantities from "../pages/AreasOfImportance/AreasOfImportance";
import Settings from "../pages/Settings";
import { useEffect } from "react";

const App = () => {
  const Drawer = createDrawerNavigator();
  const theme = useRecoilValue(themeAtom);
  const [alert, setAlert] = useRecoilState(alertAtom);

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
    <ThemeProvider theme={theme}>
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
            name={`Daily Planner. Date: ${date}`}
            options={{ drawerLabel: "Home" }}
            component={Home}
          />
          <Drawer.Screen
            name="ActionsList"
            options={{ drawerLabel: "Actions List" }}
            component={ActionsList}
          />
          <Drawer.Screen
            name="Areas Of Importance"
            options={{ drawerLabel: "AOI" }}
            component={Quantities}
          />
          <Drawer.Screen
            name="Settings"
            options={{ drawerLabel: "Settings" }}
            component={Settings}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
