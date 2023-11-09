import { View, Text, StyleSheet, Dimensions } from "react-native";
import { FC } from "react";

import { ActionItemT, ThemeT } from "~types/Types";
import { HomeActionItem } from "~pages/Home/HomeActionItem";
import { AreaOfImportanceItemT } from "~types/Types";
import { useRecoilValue } from "recoil";
import { themeAtom } from "~recoil/themeAtom";

type HomeActionSectionT = {
  aoi: AreaOfImportanceItemT;
  data: ActionItemT[];
  actionKeys: string[];
  setActions: any;
};

export const HomeActionSection: FC<HomeActionSectionT> = ({
  aoi,
  data,
  setActions,
  actionKeys,
}) => {
  const windowWidth = Dimensions.get("window").width;
  const colors = useRecoilValue(themeAtom);
  const styles = styling(aoi.Color, windowWidth, colors);

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

const styling = (color: string, windowWidth: number, colors: ThemeT) =>
  StyleSheet.create({
    container: {
      marginHorizontal: 10,
      width: windowWidth - 50,
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
