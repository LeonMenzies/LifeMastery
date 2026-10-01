import { FC } from "react";
import { StyleSheet, View } from "react-native";

import { IconButton } from "~components/IconButton";
import { Screen, ScreenHeader } from "~components/Screen";
import { SegmentedControl } from "~components/SegmentedControl";
import { PlanCard } from "~pages/Plan/PlanCard";
import { useDataStore } from "~store/dataStore";
import { useUiStore } from "~store/uiStore";
import { space } from "~theme/Theme";
import { PlanDayT } from "~types/Types";
import { formatShortDate } from "~utils/Dates";

export const Plan: FC = () => {
  const day = useUiStore((s) => s.planDay);
  const setDay = useUiStore((s) => s.setPlanDay);
  const openActionSheet = useUiStore((s) => s.openActionSheet);
  const today = useDataStore((s) => s.today);
  const tomorrow = useDataStore((s) => s.tomorrow);

  return (
    <Screen>
      <ScreenHeader title="Plan" right={<IconButton icon="add" label="New action" filled onPress={() => openActionSheet()} />} />
      <View style={styles.segment}>
        <SegmentedControl<PlanDayT>
          label="Day to plan"
          value={day}
          onChange={setDay}
          options={[
            { value: "today", label: "Today", sublabel: formatShortDate(today.date) },
            { value: "tomorrow", label: "Tomorrow", sublabel: formatShortDate(tomorrow.date) },
          ]}
        />
      </View>
      <PlanCard key={day} day={day} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  segment: {
    paddingHorizontal: space.lg,
    paddingBottom: space.md,
  },
});
