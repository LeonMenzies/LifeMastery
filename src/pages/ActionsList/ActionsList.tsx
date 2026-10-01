import { FC, useMemo, useState } from "react";
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { AppText } from "~components/AppText";
import { Button } from "~components/Button";
import { Card } from "~components/Card";
import { Chip } from "~components/Chip";
import { IconButton } from "~components/IconButton";
import { Screen, ScreenHeader } from "~components/Screen";
import { SegmentedControl } from "~components/SegmentedControl";
import { TextField } from "~components/TextField";
import { ActionsListItem } from "~pages/ActionsList/ActionsListItem";
import { useDataStore } from "~store/dataStore";
import { useUiStore } from "~store/uiStore";
import { radius, space, useAreaColor, useTheme } from "~theme/Theme";
import { ActionT } from "~types/Types";
import { haptic } from "~utils/Haptics";

type SortT = "date" | "time" | "area";

export const ActionsList: FC = () => {
  const colors = useTheme();
  const areaColor = useAreaColor();
  const actions = useDataStore((s) => s.actions);
  const areas = useDataStore((s) => s.areas);
  const today = useDataStore((s) => s.today);
  const deleteActions = useDataStore((s) => s.deleteActions);
  const openActionSheet = useUiStore((s) => s.openActionSheet);
  const setAreasSheet = useUiStore((s) => s.setAreasSheet);

  const [query, setQuery] = useState("");
  const [areaFilter, setAreaFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<SortT>("date");
  const [desc, setDesc] = useState(true);
  const [showComplete, setShowComplete] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const areaById = useMemo(() => new Map(areas.map((a, i) => [a.id, { ...a, index: i }])), [areas]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return actions
      .filter((a) => (showComplete ? true : !a.completedOn))
      .filter((a) => !areaFilter || a.areaId === areaFilter)
      .filter((a) => !q || a.title.toLowerCase().includes(q))
      .sort((a: ActionT, b: ActionT) => {
        let comparison = 0;
        if (sort === "date") comparison = a.createdAt.localeCompare(b.createdAt);
        if (sort === "time") comparison = a.minutes - b.minutes;
        if (sort === "area") comparison = (areaById.get(a.areaId)?.index ?? 99) - (areaById.get(b.areaId)?.index ?? 99);
        return desc ? -comparison : comparison;
      });
  }, [actions, query, areaFilter, sort, desc, showComplete, areaById]);

  const toggleSelected = (id: string) => {
    haptic.tap();
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const stopSelecting = () => {
    setSelecting(false);
    setSelected([]);
  };

  const confirmDelete = () =>
    Alert.alert(`Delete ${selected.length} action${selected.length === 1 ? "" : "s"}?`, "They'll also be removed from today's and tomorrow's plans. This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          haptic.warning();
          deleteActions(selected);
          stopSelecting();
        },
      },
    ]);

  const remaining = actions.filter((a) => !a.completedOn).length;

  return (
    <Screen>
      <ScreenHeader
        title="Actions"
        subtitle={`${remaining} to do`}
        right={
          selecting ? (
            <Button title="Done" variant="tinted" small onPress={stopSelecting} />
          ) : (
            <>
              <Button title="Areas" variant="tinted" small icon="albums-outline" onPress={() => setAreasSheet(true)} accessibilityHint="Manage your areas of importance" />
              <IconButton icon="add" label="New action" filled onPress={() => openActionSheet()} />
            </>
          )
        }
      />

      <View style={styles.controls}>
        <TextField value={query} onChangeText={setQuery} placeholder="Search actions" returnKeyType="search" clearButtonMode="while-editing" accessibilityLabel="Search actions" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroller} contentContainerStyle={styles.chips} keyboardShouldPersistTaps="handled">
          <Chip label="All areas" selected={!areaFilter} onPress={() => setAreaFilter(null)} />
          {areas.map((area) => (
            <Chip key={area.id} label={area.name} color={areaColor(area.color)} selected={areaFilter === area.id} onPress={() => setAreaFilter(areaFilter === area.id ? null : area.id)} />
          ))}
          <Chip label="New area" icon="add" onPress={() => setAreasSheet(true)} />
        </ScrollView>
        <View style={styles.sortRow}>
          <View style={styles.flex}>
            <SegmentedControl<SortT>
              label="Sort by"
              value={sort}
              onChange={(v) => {
                if (v === sort) setDesc(!desc);
                setSort(v);
              }}
              options={[
                { value: "date", label: "Added" },
                { value: "time", label: "Time" },
                { value: "area", label: "Area" },
              ]}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={desc ? "Sorted descending, tap for ascending" : "Sorted ascending, tap for descending"}
            onPress={() => {
              haptic.tap();
              setDesc(!desc);
            }}
            style={[styles.squareButton, { backgroundColor: colors.fill }]}
          >
            <Ionicons name={desc ? "arrow-down" : "arrow-up"} size={18} color={colors.textMuted} />
          </Pressable>
        </View>
        <View style={styles.toolbar}>
          <Chip label="Show completed" icon={showComplete ? "eye" : "eye-off-outline"} selected={showComplete} onPress={() => setShowComplete(!showComplete)} />
          {!selecting && actions.length > 0 && <Button title="Select" variant="plain" small onPress={() => setSelecting(true)} />}
        </View>
      </View>

      <FlatList
        data={visible}
        keyExtractor={(a) => a.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Card style={styles.empty}>
            <AppText variant="headline">{actions.length === 0 ? "No actions yet" : "Nothing matches"}</AppText>
            <AppText variant="callout" tone="muted" style={styles.center}>
              {actions.length === 0 ? "Add the things you want to get done. Each one gets a time estimate and an area of importance." : "Try a different search or filter."}
            </AppText>
            {actions.length === 0 && <Button title="New action" icon="add" onPress={() => openActionSheet()} />}
          </Card>
        }
        renderItem={({ item }) => {
          const area = areaById.get(item.areaId);
          return (
            <ActionsListItem
              item={item}
              areaName={area?.name || "No area"}
              areaColor={areaColor(area?.color)}
              inTodayPlan={today.actionIds.includes(item.id)}
              selecting={selecting}
              selected={selected.includes(item.id)}
              onPress={() => (selecting ? toggleSelected(item.id) : openActionSheet(item.id))}
              onLongPress={() => {
                haptic.light();
                setSelecting(true);
                setSelected((s) => (s.includes(item.id) ? s : [...s, item.id]));
              }}
            />
          );
        }}
      />

      {selecting && (
        <View style={[styles.selectionBar, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
          <AppText variant="callout" tone="muted" style={styles.flex}>
            {selected.length} selected
          </AppText>
          <Button title="Delete" variant="destructive" icon="trash-outline" onPress={confirmDelete} disabled={selected.length === 0} />
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    textAlign: "center",
  },
  controls: {
    paddingHorizontal: space.lg,
    gap: space.md,
    paddingBottom: space.sm,
  },
  chipScroller: {
    marginHorizontal: -space.lg,
  },
  chips: {
    gap: space.sm,
    paddingHorizontal: space.lg,
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
  },
  squareButton: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  list: {
    paddingHorizontal: space.lg,
    paddingBottom: space.xxl,
  },
  empty: {
    alignItems: "center",
    gap: space.md,
    marginTop: space.lg,
  },
  selectionBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
