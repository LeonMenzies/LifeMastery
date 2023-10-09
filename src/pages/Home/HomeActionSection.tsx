import { View, Text, StyleSheet, SafeAreaView } from "react-native";

import { ActionItemT } from "~types/Types";
import { HomeActionItem } from "~pages/Home/HomeActionItem";
import { AreaOfImportanceItemT } from "~types/Types";

type HomeActionSectionT = {
  aoi: AreaOfImportanceItemT;
  data: ActionItemT[];
  actionKeys: string[];
  setActions: any;
};

export const HomeActionSection = ({ aoi, data, setActions, actionKeys }: HomeActionSectionT) => {
  const styles = styling(aoi.Color);

  const filteredData: ActionItemT[] = data
    .filter((action: ActionItemT) => {
      return action.areaOfImportance === aoi.AOI && actionKeys.includes(action.key);
    })
    .sort((a, b) => a.priority - b.priority);

  if (filteredData.length > 0)
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{aoi.AOI}</Text>
        {filteredData.map((action: ActionItemT) => (
          <HomeActionItem
            key={action.key}
            action={action}
            color={aoi.Color}
            setActions={setActions}
          />
        ))}
        <View style={styles.divider} />
      </View>
    );
};

const styling = (color: string) =>
  StyleSheet.create({
    container: {
      marginHorizontal: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
      color: color,
    },
    divider: {
      borderBottomColor: "black",
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginTop: 10,
    },
  });
