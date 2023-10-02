import { View, Text, StyleSheet, SafeAreaView } from "react-native";

import { actionItemT } from "~types/Types";
import { HomeActionItem } from "~pages/Home/HomeActionItem";
import { AreaOfImportanceItemT } from "~types/Types";
import { useEffect } from "react";

type HomeActionSectionT = {
  aoi: AreaOfImportanceItemT;
  data: actionItemT[];
  setActions: any;
};

export const HomeActionSection = ({ aoi, data, setActions }: HomeActionSectionT) => {
  const styles = styling(aoi.Color);
  const filteredData: actionItemT[] = data.filter((action: actionItemT) => {
    return action.areaOfImportance === aoi.AOI;
  });

  if (filteredData.length > 0)
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>{aoi.AOI}</Text>
        {filteredData.map((action: actionItemT) => (
          <HomeActionItem
            key={action.key}
            action={action}
            color={aoi.Color}
            setActions={setActions}
          />
        ))}
        <View style={styles.divider} />
      </SafeAreaView>
    );
};

const styling = (color: string) =>
  StyleSheet.create({
    container: {
      margin: 5,
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
