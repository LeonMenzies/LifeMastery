import { View, Text, StyleSheet, Dimensions } from "react-native";
import { FC } from "react";

import { ActionItemT, ThemeT } from "~types/Types";
import { HomeActionItem } from "~pages/Home/HomeActionItem";
import { AreaOfImportanceItemT } from "~types/Types";
import { useRecoilValue } from "recoil";
import { themeAtom } from "~recoil/themeAtom";
import { convertTime } from "~utils/Helpers";

type HomeActionSectionT = {
  aoi: AreaOfImportanceItemT;
  data: ActionItemT[];
  actionKeys: string[];
  setActions: any;
};

export const HomeActionSection: FC<HomeActionSectionT> = ({ aoi, data, setActions, actionKeys }) => {
  const windowWidth = Dimensions.get("window").width;
  const colors = useRecoilValue(themeAtom);
  const styles = styling(aoi.Color, windowWidth, colors);
  let actionSectionTotalTime = 0;

  const filteredData: ActionItemT[] = data
    .filter((action: ActionItemT) => {
      const included = action.areaOfImportance === aoi.AOI && actionKeys.includes(action.key);
      if (included) actionSectionTotalTime += action.timeEstimate;
      return included;
    })
    .sort((a, b) => a.priority - b.priority);

  if (filteredData.length > 0)
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{aoi.AOI}</Text>
          <Text>{convertTime(actionSectionTotalTime)}</Text>
        </View>
        {filteredData.map((action: ActionItemT) => (
          <HomeActionItem key={action.key} action={action} color={aoi.Color} setActions={setActions} />
        ))}
        <View style={styles.divider} />
      </View>
    );
};

const styling = (color: string, windowWidth: number, colors: ThemeT) =>
  StyleSheet.create({
    container: {
      marginHorizontal: 10,
      marginVertical: 5,
      width: windowWidth - 50,
    },
    headerContainer: {
      padding: 2,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
      color: color,
    },
    divider: {
      borderBottomColor: colors.textPrimary,
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginTop: 10,
    },
  });
