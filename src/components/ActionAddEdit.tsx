import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Switch, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { AppText } from "~components/AppText";
import { Button } from "~components/Button";
import { Chip } from "~components/Chip";
import { Sheet } from "~components/Sheet";
import { Stepper } from "~components/Stepper";
import { TextField } from "~components/TextField";
import { useAlertStore } from "~store/alertStore";
import { ActionInputT, useDataStore } from "~store/dataStore";
import { useSettingsStore } from "~store/settingsStore";
import { useUiStore } from "~store/uiStore";
import { radius, space, useAreaColor, useTheme } from "~theme/Theme";
import { MAX_ACTION_MINUTES, MAX_TITLE_LENGTH } from "~utils/Constants";
import { describeRepeat, formatDuration } from "~utils/Helpers";
import { haptic } from "~utils/Haptics";

const QUICK_MINUTES = [15, 30, 45, 60, 90, 120, 180];
const WEEKDAYS = [
  { day: 1, label: "M", name: "Monday" },
  { day: 2, label: "T", name: "Tuesday" },
  { day: 3, label: "W", name: "Wednesday" },
  { day: 4, label: "T", name: "Thursday" },
  { day: 5, label: "F", name: "Friday" },
  { day: 6, label: "S", name: "Saturday" },
  { day: 0, label: "S", name: "Sunday" },
];

const blank = (areaId: string | null): ActionInputT => ({ title: "", minutes: 30, areaId, repeat: false, repeatDays: [] });

export const ActionAddEdit: FC = () => {
  const colors = useTheme();
  const areaColor = useAreaColor();
  const { visible, editId } = useUiStore((s) => s.actionSheet);
  const close = useUiStore((s) => s.closeActionSheet);
  const setAlert = useAlertStore((s) => s.setAlert);
  const areas = useDataStore((s) => s.areas);
  const actions = useDataStore((s) => s.actions);
  const addAction = useDataStore((s) => s.addAction);
  const updateAction = useDataStore((s) => s.updateAction);
  const deleteActions = useDataStore((s) => s.deleteActions);
  const addArea = useDataStore((s) => s.addArea);
  const suggestionsOn = useSettingsStore((s) => s.settings.suggestions);

  const [form, setForm] = useState<ActionInputT>(blank(null));
  const [newArea, setNewArea] = useState<string | null>(null);
  const [lastAdded, setLastAdded] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const lastAreaId = useRef<string | null>(null);
  const titleRef = useRef<TextInput>(null);

  const editing = editId ? actions.find((a) => a.id === editId) : null;

  useEffect(() => {
    if (!visible) return;
    setNewArea(null);
    setLastAdded("");
    setShowSuggestions(false);
    if (editing) {
      setForm({ title: editing.title, minutes: editing.minutes, areaId: editing.areaId, repeat: editing.repeat, repeatDays: editing.repeatDays });
    } else {
      const areaId = areas.some((a) => a.id === lastAreaId.current) ? lastAreaId.current : areas[0]?.id || null;
      setForm(blank(areaId));
    }
  }, [visible, editId]);

  const update = (patch: Partial<ActionInputT>) => setForm((f) => ({ ...f, ...patch }));

  const suggestions = useMemo(() => {
    const query = form.title.trim().toLowerCase();
    if (!suggestionsOn || !showSuggestions || query.length < 2) return [];
    const seen = new Set<string>();
    return actions
      .filter((a) => {
        const key = a.title.toLowerCase();
        if (seen.has(key) || key === query || !key.includes(query)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => Number(b.title.toLowerCase().startsWith(query)) - Number(a.title.toLowerCase().startsWith(query)) || a.title.length - b.title.length)
      .slice(0, 3);
  }, [form.title, actions, suggestionsOn, showSuggestions]);

  const handleCreateArea = () => {
    const result = addArea(newArea || "");
    if (result.ok === false) {
      setAlert({ message: result.message, type: "warning" });
      return;
    }
    update({ areaId: result.id });
    setNewArea(null);
    haptic.light();
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      setAlert({ message: "Give the action a name", type: "warning" });
      return;
    }
    if (!form.areaId) {
      setAlert({ message: "Pick an area of importance", type: "warning" });
      return;
    }
    lastAreaId.current = form.areaId;
    haptic.success();
    if (editing) {
      updateAction(editing.id, form);
      close();
      return;
    }
    addAction(form);
    setLastAdded(form.title.trim());
    setForm(blank(form.areaId));
    setShowSuggestions(false);
    titleRef.current?.focus();
  };

  const handleDelete = () =>
    Alert.alert("Delete this action?", `"${editing.title}" will be removed from your actions and any plans.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteActions([editing.id]);
          close();
        },
      },
    ]);

  const toggleDay = (day: number) => {
    haptic.tap();
    update({ repeatDays: form.repeatDays.includes(day) ? form.repeatDays.filter((d) => d !== day) : [...form.repeatDays, day] });
  };

  return (
    <Sheet
      visible={visible}
      onClose={close}
      title={editing ? "Edit action" : "New action"}
      closeLabel={editing ? "Cancel" : "Done"}
      footer={
        <View style={styles.footer}>
          {editing && <Button title="Delete" variant="destructive" icon="trash-outline" onPress={handleDelete} />}
          <Button title={editing ? "Save changes" : "Add action"} icon={editing ? undefined : "add"} onPress={handleSave} style={styles.flex} />
        </View>
      }
    >
      {lastAdded ? (
        <View style={[styles.added, { backgroundColor: colors.successSoft }]}>
          <Ionicons name="checkmark-circle" size={18} color={colors.success} />
          <AppText variant="callout" color={colors.success} style={styles.flex} numberOfLines={1}>
            Added "{lastAdded}". Add another or tap Done.
          </AppText>
        </View>
      ) : null}

      <View style={styles.section}>
        <TextField
          ref={titleRef}
          label="Action"
          value={form.title}
          onChangeText={(title) => {
            update({ title });
            setShowSuggestions(true);
          }}
          placeholder="e.g. Go for a run"
          maxLength={MAX_TITLE_LENGTH}
          autoFocus={!editId}
          returnKeyType="done"
          onSubmitEditing={() => setShowSuggestions(false)}
        />
        {suggestions.length > 0 && (
          <View style={[styles.suggestions, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <AppText variant="caption" tone="faint" style={styles.suggestionsLabel}>
              FROM YOUR PAST ACTIONS
            </AppText>
            {suggestions.map((s) => (
              <Pressable
                key={s.id}
                accessibilityRole="button"
                accessibilityHint="Fills in the name, area and time"
                onPress={() => {
                  haptic.tap();
                  setForm((f) => ({ ...f, title: s.title, minutes: s.minutes, areaId: areas.some((a) => a.id === s.areaId) ? s.areaId : f.areaId }));
                  setShowSuggestions(false);
                }}
                style={({ pressed }) => [styles.suggestion, { opacity: pressed ? 0.6 : 1 }]}
              >
                <AppText variant="body" style={styles.flex} numberOfLines={1}>
                  {s.title}
                </AppText>
                <AppText variant="footnote" tone="muted">
                  {formatDuration(s.minutes)}
                </AppText>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <AppText variant="footnote" weight="600" tone="muted" style={styles.label}>
          AREA OF IMPORTANCE
        </AppText>
        <View style={styles.wrap}>
          {areas.map((area) => (
            <Chip
              key={area.id}
              label={area.name}
              color={areaColor(area.color)}
              selected={form.areaId === area.id}
              onPress={() => {
                haptic.tap();
                update({ areaId: area.id });
              }}
            />
          ))}
          {newArea === null && <Chip label="New area" icon="add" onPress={() => setNewArea("")} />}
        </View>
        {newArea !== null && (
          <View style={styles.newArea}>
            <View style={styles.flex}>
              <TextField value={newArea} onChangeText={setNewArea} placeholder="Area name, e.g. Health" autoFocus returnKeyType="done" onSubmitEditing={handleCreateArea} />
            </View>
            <Button title="Add" small onPress={handleCreateArea} />
          </View>
        )}
        {areas.length === 0 && newArea === null && (
          <AppText variant="footnote" tone="muted" style={styles.hint}>
            Areas are the parts of life your actions serve, like Health or Work. Create your first one to continue.
          </AppText>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <AppText variant="footnote" weight="600" tone="muted" style={styles.flex}>
            TIME ESTIMATE
          </AppText>
          <Stepper label="Time estimate" value={form.minutes} onChange={(minutes) => update({ minutes })} min={5} max={MAX_ACTION_MINUTES} step={5} format={formatDuration} />
        </View>
        <View style={[styles.wrap, styles.quick]}>
          {QUICK_MINUTES.map((m) => (
            <Chip
              key={m}
              label={formatDuration(m)}
              selected={form.minutes === m}
              onPress={() => {
                haptic.tap();
                update({ minutes: m });
              }}
            />
          ))}
        </View>
      </View>

      <View style={[styles.section, styles.repeatCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.row}>
          <Ionicons name="repeat" size={20} color={colors.textMuted} />
          <View style={styles.flex}>
            <AppText variant="body">Repeat</AppText>
            <AppText variant="footnote" tone="muted">
              {form.repeat ? `${describeRepeat(form)}. Stays in your list after you complete it.` : "Disappears from your list once done"}
            </AppText>
          </View>
          <Switch
            accessibilityLabel="Repeat"
            value={form.repeat}
            onValueChange={(repeat) => {
              haptic.tap();
              update({ repeat });
            }}
            trackColor={{ true: colors.accent, false: colors.fill }}
          />
        </View>
        {form.repeat && (
          <View style={styles.days}>
            {WEEKDAYS.map(({ day, label, name }) => {
              const on = form.repeatDays.includes(day);
              return (
                <Pressable
                  key={day}
                  accessibilityRole="checkbox"
                  accessibilityLabel={name}
                  accessibilityState={{ checked: on }}
                  onPress={() => toggleDay(day)}
                  style={[styles.day, { backgroundColor: on ? colors.brand : colors.fill }]}
                >
                  <AppText variant="callout" weight="600" color={on ? colors.onBrand : colors.textMuted}>
                    {label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        )}
        {form.repeat && (
          <AppText variant="footnote" tone="faint">
            Leave all days off to repeat every day. Due actions show at the top when planning.
          </AppText>
        )}
      </View>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  section: {
    marginTop: space.xl,
  },
  label: {
    marginBottom: space.sm,
    letterSpacing: 0.5,
  },
  hint: {
    marginTop: space.sm,
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  quick: {
    marginTop: space.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
  },
  newArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    marginTop: space.md,
  },
  added: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    marginTop: space.md,
  },
  suggestions: {
    marginTop: space.sm,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  suggestionsLabel: {
    marginBottom: space.xs,
    letterSpacing: 0.5,
  },
  suggestion: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    minHeight: 40,
  },
  repeatCard: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: space.lg,
    gap: space.md,
  },
  days: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  day: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    flexDirection: "row",
    gap: space.md,
  },
});
