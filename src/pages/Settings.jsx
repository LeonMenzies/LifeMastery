import { View, SafeAreaView, Button } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSetRecoilState } from "recoil";
import { themeAtom, lightTheme, darkTheme } from "../recoil/themeAtom";
import { storeData, getData } from "../utils/Storage";

const Settings = () => {
  const setTheme = useSetRecoilState(themeAtom);

  return (
    <SafeAreaView>
      <View>
        <Button title="Light mode" onPress={() => setTheme(lightTheme)} />
        <Button title="Dark mode" onPress={() => setTheme(darkTheme)} />
        <Button
          title="Clear Actions"
          onPress={() => storeData(JSON.stringify([]), "actions-list")}
        />

        <FontAwesome name="facebook" size={50} />
      </View>
    </SafeAreaView>
  );
};

export default Settings;
