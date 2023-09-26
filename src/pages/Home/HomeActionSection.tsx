import { View, Text, StyleSheet, Button, SafeAreaView } from "react-native";
import { actionItemT } from "../../types/Types";
import HomeActionItem from "./HomeActionItem";
import { AreaOfImportanceItemT } from "../../types/Types";

type HomeActionSectionT = {
  aoi: AreaOfImportanceItemT;
  data: actionItemT[];
};

const HomeActionSection = ({ aoi, data }: HomeActionSectionT) => {
  const styles = styling(aoi.Color);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{aoi.AOI}</Text>
      </View>

      {[...data]
        .sort((a: actionItemT, b: actionItemT) => a.priority - b.priority)
        .map((action: actionItemT) => {
          if (action.areaOfImportance == aoi.AOI) {
            return <HomeActionItem key={action.key} action={action} color={aoi.Color} />;
          }
        })}

      <View style={styles.divider} />
    </SafeAreaView>
  );
};

const styling = (color: string) =>
  StyleSheet.create({
    container: {
      margin: 5,
    },
    header: {},
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

export default HomeActionSection;
