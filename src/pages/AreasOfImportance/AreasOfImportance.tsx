import "react-native-get-random-values";
import DraggableFlatList from "react-native-draggable-flatlist";
import { useEffect, FC } from "react";
import { Text, SafeAreaView, StyleSheet, View } from "react-native";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";

import { AreasOfImportanceItem } from "~pages/AreasOfImportance/AreasOfImportanceItem";
import { getAreasOfImportance } from "~utils/AreasOfImportanceHandler";
import { AreasOfImportanceAdd } from "~pages/AreasOfImportance/AreasOfImportanceAdd";
import { alertAtom } from "~recoil/alertAtom";
import { areasOfImportanceAtom } from "~recoil/areasOfImportanceAtom";
import { themeAtom } from "~recoil/themeAtom";
import { AreaOfImportanceItemT, ThemeT } from "~types/Types";
import { NavigatorItem } from "~components/navigator/NavigatorItem";

export const AreasOfImportance: FC<any> = () => {
  const [data, setData] = useRecoilState(areasOfImportanceAtom);
  const setAlert = useSetRecoilState(alertAtom);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  useEffect(() => {
    getAreasOfImportance(setAlert, setData);
  }, []);

  return (
    <NavigatorItem rightButton={() => {}} rightButtonIcon={""} title={"Areas Of Importance"}>
      <View style={styles.container}>
        <AreasOfImportanceAdd />

        <View>
          {data.map((item: AreaOfImportanceItemT, index: number) => (
            <AreasOfImportanceItem key={index} item={item} />
          ))}
        </View>
      </View>
    </NavigatorItem>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      height: "100%",
      alignItems: "center",
    },
  });
