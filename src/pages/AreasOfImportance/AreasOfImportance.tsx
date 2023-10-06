import "react-native-get-random-values";
import DraggableFlatList from "react-native-draggable-flatlist";
import React, { useEffect } from "react";
import { Text, SafeAreaView, StyleSheet, View } from "react-native";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";

import { AreasOfImportanceItem } from "~pages/AreasOfImportance/AreasOfImportanceItem";
import { getAreasOfImportance } from "~utils/AreasOfImportanceHandler";
import { AreasOfImportanceAdd } from "~pages/AreasOfImportance/AreasOfImportanceAdd";
import { alertAtom } from "~recoil/alertAtom";
import { areasOfImportanceAtom } from "~recoil/areasOfImportanceAtom";
import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

export const AreasOfImportance = () => {
  const [data, setData] = useRecoilState(areasOfImportanceAtom);
  const setAlert = useSetRecoilState(alertAtom);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  useEffect(() => {
    getAreasOfImportance(setAlert, setData);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <AreasOfImportanceAdd />

      <View>
        {data.length > 0 ? (
          <DraggableFlatList
            data={data}
            onDragEnd={({ data }) => setData(data)}
            keyExtractor={(item) => item.key}
            renderItem={AreasOfImportanceItem}
          />
        ) : (
          <Text>No AOL's in your list</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      height: "100%",
      width: 300,
      alignContent: "center",
    },
  });
