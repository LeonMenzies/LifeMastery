import { FC, useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";

import { AppText } from "~components/AppText";
import { Button } from "~components/Button";
import { Chip } from "~components/Chip";
import { Sheet } from "~components/Sheet";
import { TextField } from "~components/TextField";
import { AreasOfImportanceItem } from "~pages/AreasOfImportance/AreasOfImportanceItem";
import { useAlertStore } from "~store/alertStore";
import { useDataStore } from "~store/dataStore";
import { useUiStore } from "~store/uiStore";
import { space } from "~theme/Theme";
import { MAX_AREAS, MAX_AREA_NAME_LENGTH, STARTER_AREAS } from "~utils/Constants";
import { haptic } from "~utils/Haptics";

export const AreasOfImportance: FC = () => {
  const visible = useUiStore((s) => s.areasSheet);
  const setVisible = useUiStore((s) => s.setAreasSheet);
  const areas = useDataStore((s) => s.areas);
  const actions = useDataStore((s) => s.actions);
  const addArea = useDataStore((s) => s.addArea);
  const deleteArea = useDataStore((s) => s.deleteArea);
  const reorderAreas = useDataStore((s) => s.reorderAreas);
  const setAlert = useAlertStore((s) => s.setAlert);
  const [name, setName] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setName("");
      setExpanded(null);
    }
  }, [visible]);

  const add = (value: string) => {
    const result = addArea(value);
    if (result.ok === false) {
      haptic.warning();
      setAlert({ message: result.message, type: "warning" });
      return;
    }
    haptic.light();
    setName("");
  };

  const confirmDelete = (id: string) => {
    const area = areas.find((a) => a.id === id);
    const count = actions.filter((a) => a.areaId === id).length;
    Alert.alert(`Delete "${area.name}"?`, count > 0 ? `${count} action${count === 1 ? "" : "s"} will move to "No area". You can give them a new area later.` : "This area has no actions.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteArea(id);
          setExpanded(null);
        },
      },
    ]);
  };

  const unusedStarters = STARTER_AREAS.filter((s) => !areas.some((a) => a.name.toLowerCase() === s.toLowerCase()));
  const full = areas.length >= MAX_AREAS;

  const header = (
    <View style={styles.header}>
      <AppText variant="callout" tone="muted">
        Areas of importance are the parts of life your actions serve. Today groups your plan by them, in this order.
      </AppText>
      {!full && (
        <View style={styles.addRow}>
          <View style={styles.flex}>
            <TextField value={name} onChangeText={setName} placeholder="New area name" maxLength={MAX_AREA_NAME_LENGTH} returnKeyType="done" onSubmitEditing={() => add(name)} />
          </View>
          <Button title="Add" onPress={() => add(name)} disabled={!name.trim()} />
        </View>
      )}
      {!full && unusedStarters.length > 0 && (
        <View style={styles.wrap}>
          {unusedStarters.map((s) => (
            <Chip key={s} label={s} icon="add" onPress={() => add(s)} />
          ))}
        </View>
      )}
      {full && (
        <AppText variant="footnote" tone="muted">
          You've reached {MAX_AREAS} areas, the most the app supports. Delete one to add another.
        </AppText>
      )}
      {areas.length > 1 && (
        <AppText variant="footnote" tone="faint">
          Hold the handle to drag areas into order. Tap an area to rename it, change its colour or set a weekly target.
        </AppText>
      )}
    </View>
  );

  return (
    <Sheet visible={visible} onClose={() => setVisible(false)} title="Areas" closeLabel="Done" scroll={false}>
      <DraggableFlatList
        data={areas}
        keyExtractor={(a) => a.id}
        ListHeaderComponent={header}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
        activationDistance={8}
        onDragBegin={() => haptic.light()}
        onDragEnd={({ data }) => reorderAreas(data.map((a) => a.id))}
        renderItem={({ item, drag, isActive }) => (
          <AreasOfImportanceItem
            area={item}
            actionCount={actions.filter((a) => a.areaId === item.id && !a.completedOn).length}
            expanded={expanded === item.id}
            onToggle={() => setExpanded(expanded === item.id ? null : item.id)}
            onDrag={drag}
            dragging={isActive}
            onDelete={() => confirmDelete(item.id)}
          />
        )}
      />
    </Sheet>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  list: {
    paddingBottom: space.xxxl,
  },
  header: {
    gap: space.md,
    paddingTop: space.sm,
    paddingBottom: space.lg,
  },
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
});
