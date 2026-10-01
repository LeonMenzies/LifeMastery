import AsyncStorage from "@react-native-async-storage/async-storage";

import { ActionT, AreaT, DataT, PlanT, SettingsT } from "~types/Types";
import { AREA_COLORS, DATA_KEY, SETTINGS_KEY, STORE_VERSION, V1_AREA_COLORS, V1_KEYS } from "~utils/Constants";
import { DateOrderT, detectDateOrder, parseLocaleDate, todayISO, addDays } from "~utils/Dates";
import { emptyPlan } from "~utils/PlanLogic";
import { defaultSettings } from "~store/settingsStore";

type V1Action = { key: string; action: string; isCompleted: boolean; timeEstimate: number; priority: number; areaOfImportance: string; dateAdded: string; repeat: boolean };
type V1Area = { key: string; AOI: string; Color: string };
type V1Plan = { key?: string; date: string; finalized: boolean; complete?: boolean; actionKeys: string[]; focus?: string };
type V1Settings = { timePercent: boolean; lightMode: boolean; autoComplete: boolean; maxPlanTime: number };

export type V1DataT = {
  actions: V1Action[] | null;
  areas: V1Area[] | null;
  today: V1Plan | null;
  tomorrow: V1Plan | null;
  settings: V1Settings | null;
};

export const migrateV1 = (v1: V1DataT, today: string, order: DateOrderT): { data: DataT; settings: SettingsT } => {
  const v1Areas = v1.areas || [];
  const v1Actions = v1.actions || [];

  const areas: AreaT[] = v1Areas.map((a) => ({ id: a.key, name: a.AOI, color: AREA_COLORS[V1_AREA_COLORS.indexOf(a.Color)] || a.Color, weeklyTargetMinutes: 0 }));
  const areaIdByName = new Map(v1Areas.map((a) => [a.AOI, a.key]));
  const todayPlanDate = v1.today ? parseLocaleDate(v1.today.date, order) : null;
  const todayKeys = new Set(v1.today?.actionKeys || []);

  // Every completed repeating action spawned a fresh copy in v1; fold each family back into one template.
  const idMap = new Map<string, string>();
  const repeatGroups = new Map<string, V1Action[]>();
  v1Actions.forEach((a) => {
    if (!a.repeat) return;
    const groupKey = `${a.action.trim().toLowerCase()}|${a.areaOfImportance}`;
    repeatGroups.set(groupKey, [...(repeatGroups.get(groupKey) || []), a]);
  });
  const templateIds = new Set<string>();
  repeatGroups.forEach((group) => {
    const template = group.find((a) => !a.isCompleted) || group[0];
    templateIds.add(template.key);
    group.forEach((a) => idMap.set(a.key, template.key));
  });

  const actions: ActionT[] = v1Actions
    .filter((a) => !a.repeat || templateIds.has(a.key))
    .map((a) => {
      const createdAt = parseLocaleDate(a.dateAdded, order) || today;
      let completedOn: string | null = null;
      if (!a.repeat && a.isCompleted) completedOn = todayKeys.has(a.key) && todayPlanDate ? todayPlanDate : createdAt;
      idMap.set(a.key, a.key);
      return {
        id: a.key,
        title: a.action,
        minutes: Number(a.timeEstimate) || 0,
        areaId: areaIdByName.get(a.areaOfImportance) || null,
        repeat: !!a.repeat,
        repeatDays: [],
        createdAt,
        completedOn,
      };
    });

  const v1ById = new Map(v1Actions.map((a) => [a.key, a]));
  const convertPlan = (plan: V1Plan | null, fallbackDate: string): PlanT => {
    if (!plan) return emptyPlan(fallbackDate);
    const date = parseLocaleDate(plan.date, order) || "";
    const actionIds: string[] = [];
    const priorities: Record<string, number> = {};
    const completedIds: string[] = [];
    (plan.actionKeys || []).forEach((key) => {
      const id = idMap.get(key);
      const original = v1ById.get(key);
      if (!id || !original || actionIds.includes(id)) return;
      actionIds.push(id);
      priorities[id] = original.priority || 1;
      if (original.isCompleted) completedIds.push(id);
    });
    return { date, actionIds, priorities, completedIds, finalized: !!plan.finalized, focus: plan.focus || "" };
  };

  const s = v1.settings;
  const settings: SettingsT = s
    ? {
        ...defaultSettings,
        appearance: s.lightMode === false ? "dark" : "system",
        progressBy: s.timePercent === false ? "tasks" : "time",
        maxPlanHours: s.maxPlanTime || defaultSettings.maxPlanHours,
        suggestions: s.autoComplete !== false,
      }
    : defaultSettings;

  return {
    data: {
      areas,
      actions,
      today: convertPlan(v1.today, today),
      tomorrow: convertPlan(v1.tomorrow, addDays(today, 1)),
      history: [],
      carryOver: [],
    },
    settings,
  };
};

const parse = (raw: string | null) => {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Runs before the stores hydrate. v1 keys are left in place so an older build still finds its data.
export const migrateStorageIfNeeded = async () => {
  if (await AsyncStorage.getItem(DATA_KEY)) return;
  const entries = await AsyncStorage.multiGet(Object.values(V1_KEYS));
  const raw = Object.fromEntries(entries.map(([k, v]) => [k, parse(v)]));
  if (Object.values(raw).every((v) => v === null)) return;

  const { data, settings } = migrateV1(
    {
      actions: raw[V1_KEYS.actions],
      areas: raw[V1_KEYS.areas],
      today: raw[V1_KEYS.today],
      tomorrow: raw[V1_KEYS.tomorrow],
      settings: raw[V1_KEYS.settings],
    },
    todayISO(),
    detectDateOrder(),
  );

  await AsyncStorage.multiSet([
    [DATA_KEY, JSON.stringify({ state: data, version: STORE_VERSION })],
    [SETTINGS_KEY, JSON.stringify({ state: { settings }, version: STORE_VERSION })],
  ]);
};
