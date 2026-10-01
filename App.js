import "react-native-get-random-values";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Navigator } from "~components/navigator/Navigator";
import { useDataStore } from "~store/dataStore";
import { useSettingsStore } from "~store/settingsStore";
import { useTheme } from "~theme/Theme";
import { migrateStorageIfNeeded } from "~utils/Migration";

const App = () => {
  const [ready, setReady] = useState(false);
  const colors = useTheme();

  useEffect(() => {
    migrateStorageIfNeeded()
      .catch((e) => console.warn("Migration failed", e))
      .then(() => Promise.all([useDataStore.persist.rehydrate(), useSettingsStore.persist.rehydrate()]))
      .then(() => {
        useDataStore.getState().rollover();
        setReady(true);
      });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <RootSiblingParent>{ready ? <Navigator /> : <View style={{ flex: 1, backgroundColor: colors.background }} />}</RootSiblingParent>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
