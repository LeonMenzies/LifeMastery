import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useEffect } from "react";
import { authAtom } from "../recoil/authAtom";
import { themeAtom } from "../recoil/themeAtom";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { colors } from "../styles/GlobalStyles";
import { ThemeProvider, Button, createTheme } from "@rneui/themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import Home from "../pages/Home/Home";
import ActionsList from "../pages/ActionsList/ActionsList";
import Quantities from "../pages/Quantities";
import Settings from "../pages/Settings";
import { Text } from "react-native";

const App = () => {
  const Drawer = createDrawerNavigator();
  const theme = useRecoilValue(themeAtom);

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
            name="Quantities"
            options={{ drawerLabel: "Quantities" }}
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
