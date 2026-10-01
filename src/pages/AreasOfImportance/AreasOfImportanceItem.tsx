import { FC, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { AppText } from "~components/AppText";
import { Button } from "~components/Button";
import { Stepper } from "~components/Stepper";
import { TextField } from "~components/TextField";
import { useAlertStore } from "~store/alertStore";
import { useDataStore } from "~store/dataStore";
import { radius, space, useAreaColor, useTheme } from "~theme/Theme";
import { AreaT } from "~types/Types";
import { AREA_COLORS, MAX_AREA_NAME_LENGTH } from "~utils/Constants";
import { formatDuration } from "~utils/Helpers";
import { haptic } from "~utils/Haptics";

type AreasOfImportanceItemT = {
  area: AreaT;
  actionCount: number;
  expanded: boolean;
  onToggle: () => void;
  onDrag: () => void;
  dragging: boolean;
  onDelete: () => void;
};

export const AreasOfImportanceItem: FC<AreasOfImportanceItemT> = ({ area, actionCount, expanded, onToggle, onDrag, dragging, onDelete }) => {
  const colors = useTheme();
  const areaColor = useAreaColor();
  const updateArea = useDataStore((s) => s.updateArea);
  const setAlert = useAlertStore((s) => s.setAlert);
  const [name, setName] = useState(area.name);

  useEffect(() => setName(area.name), [area.name, expanded]);

  const saveName = () => {
    if (name === area.name) return;
    const result = updateArea(area.id, { name });
    if (result.ok === false) {
      setAlert({ message: result.message, type: "warning" });
      setName(area.name);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: dragging ? areaColor(area.color) : colors.border }]}>
      <View style={styles.row}>
        <Pressable onPressIn={onDrag} accessibilityLabel={`Reorder ${area.name}`} accessibilityHint="Drag to reorder" hitSlop={8} style={styles.handle}>
          <Ionicons name="reorder-three" size={24} color={colors.textFaint} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityState={{ expanded }} onPress={onToggle} style={styles.main}>
          <View style={[styles.swatch, { backgroundColor: areaColor(area.color) }]} />
          <View style={styles.flex}>
            <AppText variant="body" weight="600" numberOfLines={1}>
              {area.name}
            </AppText>
            <AppText variant="footnote" tone="muted">
              {actionCount} action{actionCount === 1 ? "" : "s"}
              {area.weeklyTargetMinutes ? ` · ${formatDuration(area.weeklyTargetMinutes)} a week` : ""}
            </AppText>
          </View>
          <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={18} color={colors.textFaint} />
        </Pressable>
      </View>

      {expanded && (
        <View style={[styles.editor, { borderTopColor: colors.border }]}>
          <TextField label="Name" value={name} onChangeText={setName} onBlur={saveName} onSubmitEditing={saveName} maxLength={MAX_AREA_NAME_LENGTH} returnKeyType="done" />
          <View>
            <AppText variant="footnote" weight="600" tone="muted" style={styles.label}>
              COLOUR
            </AppText>
            <View style={styles.swatches}>
              {AREA_COLORS.map((c) => {
                const on = c === area.color;
                return (
                  <Pressable
                    key={c}
                    accessibilityRole="button"
                    accessibilityLabel={`Colour ${AREA_COLORS.indexOf(c) + 1}`}
                    accessibilityState={{ selected: on }}
                    onPress={() => {
                      haptic.tap();
                      updateArea(area.id, { color: c });
                    }}
                    style={[styles.swatchButton, { borderColor: on ? colors.text : "transparent" }]}
                  >
                    <View style={[styles.swatchLarge, { backgroundColor: areaColor(c) }]}>{on && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}</View>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <View style={styles.targetRow}>
            <View style={styles.flex}>
              <AppText variant="body">Weekly target</AppText>
              <AppText variant="footnote" tone="muted">
                Shown on the Balance view
              </AppText>
            </View>
            <Stepper
              label="Weekly target"
              value={area.weeklyTargetMinutes}
              onChange={(weeklyTargetMinutes) => updateArea(area.id, { weeklyTargetMinutes })}
              min={0}
              max={60 * 60}
              step={30}
              format={(m) => (m === 0 ? "None" : formatDuration(m))}
            />
          </View>
          <Button title="Delete area" variant="destructive" icon="trash-outline" small onPress={onDelete} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: space.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  handle: {
    paddingLeft: space.md,
    paddingRight: space.xs,
    paddingVertical: space.md,
  },
  main: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingVertical: space.md,
    paddingRight: space.lg,
    paddingLeft: space.sm,
    minHeight: 56,
  },
  swatch: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  editor: {
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: space.lg,
    gap: space.lg,
  },
  label: {
    marginBottom: space.sm,
    letterSpacing: 0.5,
  },
  swatches: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  swatchButton: {
    borderWidth: 2,
    borderRadius: 20,
    padding: 2,
  },
  swatchLarge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  targetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
  },
});
