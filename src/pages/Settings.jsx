import { View, SafeAreaView, Button } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSetRecoilState } from "recoil";
import { themeAtom, lightTheme, darkTheme } from "../recoil/themeAtom";
import { clearActions } from "../utils/ActionsHandler";
import { alertAtom } from "../recoil/alertAtom";

const Settings = () => {
  const setTheme = useSetRecoilState(themeAtom);
  const setAlert = useSetRecoilState(alertAtom);

  return (
    <SafeAreaView>
      <View>
        <Button title="Light mode" onPress={() => setTheme(lightTheme)} />
        <Button title="Dark mode" onPress={() => setTheme(darkTheme)} />
        <Button title="Clear Actions" onPress={() => clearActions(setAlert)} />
        <Button title="show" onPress={() => setAlert("test")} />

        <FontAwesome name="facebook" size={50} />
      </View>
    </SafeAreaView>
  );
};

export default Settings;
