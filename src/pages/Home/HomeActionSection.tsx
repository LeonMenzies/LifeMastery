import { View, Text, StyleSheet, Button, SafeAreaView } from "react-native";
import styled from "styled-components/native";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { deleteAreaOfImportance } from "../../utils/AreasOfImportanceHandler";
import { alertAtom } from "../../recoil/alertAtom";
import { useSetRecoilState } from "recoil";
import { areasOfImportanceAtom } from "../../recoil/areasOfImportanceAtom";
import { useState, useEffect } from "react";
import { actionItemT } from "../../types/Types";
import { actionsAtom } from "../../recoil/actionsAtom";
import { AntDesign } from "@expo/vector-icons";
import HomeActionItem from "./HomeActionItem";
import { AreaOfImportanceItemT } from "../../types/Types";

type HomeActionSectionT = {
  aoi: AreaOfImportanceItemT;
  data: actionItemT[];
};

const HomeActionSection = ({ aoi, data }: HomeActionSectionT) => {
  const [sortedData, setSortedData] = useState<any>([]);
  const setAlert = useSetRecoilState(alertAtom);
  const [loading, setLoading] = useState(true);
  const setData = useSetRecoilState(actionsAtom);
  const styles = styling(aoi.Color);

  useEffect(() => {
    setSortedData(data.filter((v) => v.areaOfImportance === aoi.AOI));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{aoi.AOI}</Text>
      </View>

      {sortedData.map((action: actionItemT) => (
        <HomeActionItem key={action.key} action={action} color={aoi.Color} />
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
