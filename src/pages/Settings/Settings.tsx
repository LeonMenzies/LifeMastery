import { SafeAreaView, Button } from "react-native";
import { useSetRecoilState } from "recoil";
import { themeAtom, lightTheme, darkTheme } from "../../recoil/themeAtom";
import { clearActions } from "../../utils/ActionsHandler";
import { alertAtom } from "../../recoil/alertAtom";

const Settings = () => {
  const setTheme = useSetRecoilState(themeAtom);
  const setAlert = useSetRecoilState(alertAtom);

  return (
    <SafeAreaView>
      <Button title="Light mode" onPress={() => setTheme(lightTheme)} />
      <Button title="Dark mode" onPress={() => setTheme(darkTheme)} />
      <Button title="Clear Actions" onPress={() => clearActions(setAlert)} />
    </SafeAreaView>
  );
};

export default Settings;
