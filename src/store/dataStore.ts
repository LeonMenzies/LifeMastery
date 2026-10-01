import "react-native-get-random-values";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { ActionT, AreaT, DataT, PlanDayT, PlanT } from "~types/Types";
import { DATA_KEY, MAX_AREAS, MAX_AREA_NAME_LENGTH, STORE_VERSION } from "~utils/Constants";
import { addDays, todayISO } from "~utils/Dates";
import { nextAreaColor } from "~utils/Helpers";
import { emptyPlan, planMinutes, rollover } from "~utils/PlanLogic";

export type ResultT = { ok: true } | { ok: false; message: string };

export type ActionInputT = Pick<ActionT, "title" | "minutes" | "areaId" | "repeat" | "repeatDays">;

type DataStoreT = DataT & {
  rollover: () => void;
  replaceData: (data: DataT) => void;

  addArea: (name: string) => ResultT & { id?: string };
  updateArea: (id: string, patch: Partial<Omit<AreaT, "id">>) => ResultT;
  deleteArea: (id: string) => void;
  reorderAreas: (ids: string[]) => void;

  addAction: (input: ActionInputT) => ActionT;
  updateAction: (id: string, patch: Partial<ActionInputT>) => void;
  deleteActions: (ids: string[]) => void;
  clearActions: () => void;

  setPriority: (day: PlanDayT, id: string, priority: number) => void;
  removeFromPlan: (day: PlanDayT, id: string) => void;
  setFocus: (day: PlanDayT, focus: string) => void;
  finalizeToday: (maxMinutes: number) => ResultT;
  editToday: () => void;
  clearPlan: (day: PlanDayT) => void;
  toggleComplete: (id: string) => void;
  acceptCarryOver: () => void;
  dismissCarryOver: () => void;
};

const initialData = (): DataT => {
  const today = todayISO();
  return { areas: [], actions: [], today: emptyPlan(today), tomorrow: emptyPlan(addDays(today, 1)), history: [], carryOver: [] };
};

const dropFromPlan = (plan: PlanT, ids: string[]): PlanT => {
  const priorities = { ...plan.priorities };
  ids.forEach((id) => delete priorities[id]);
  return {
    ...plan,
    actionIds: plan.actionIds.filter((id) => !ids.includes(id)),
    completedIds: plan.completedIds.filter((id) => !ids.includes(id)),
    priorities,
  };
};

const validateAreaName = (areas: AreaT[], name: string, exceptId?: string): ResultT => {
  const trimmed = name.trim();
  if (!trimmed) return { ok: false, message: "Give the area a name" };
  if (trimmed.length > MAX_AREA_NAME_LENGTH) return { ok: false, message: `Area names can be up to ${MAX_AREA_NAME_LENGTH} characters` };
  if (areas.some((a) => a.id !== exceptId && a.name.toLowerCase() === trimmed.toLowerCase())) return { ok: false, message: "You already have an area with that name" };
  return { ok: true };
};

export const useDataStore = create<DataStoreT>()(
  persist(
    (set, get) => ({
      ...initialData(),

      rollover: () => set((s) => rollover(s, todayISO())),
      replaceData: (data) => set(rollover(data, todayISO())),

      addArea: (name) => {
        const { areas } = get();
        if (areas.length >= MAX_AREAS) return { ok: false, message: `You can have up to ${MAX_AREAS} areas` };
        const valid = validateAreaName(areas, name);
        if (valid.ok === false) return valid;
        const area: AreaT = { id: uuidv4(), name: name.trim(), color: nextAreaColor(areas), weeklyTargetMinutes: 0 };
        set({ areas: [...areas, area] });
        return { ok: true, id: area.id };
      },
      updateArea: (id, patch) => {
        if (patch.name !== undefined) {
          const valid = validateAreaName(get().areas, patch.name, id);
          if (valid.ok === false) return valid;
          patch = { ...patch, name: patch.name.trim() };
        }
        set((s) => ({ areas: s.areas.map((a) => (a.id === id ? { ...a, ...patch } : a)) }));
        return { ok: true };
      },
      deleteArea: (id) =>
        set((s) => ({
          areas: s.areas.filter((a) => a.id !== id),
          actions: s.actions.map((a) => (a.areaId === id ? { ...a, areaId: null } : a)),
        })),
      reorderAreas: (ids) => set((s) => ({ areas: ids.map((id) => s.areas.find((a) => a.id === id)).filter(Boolean) })),

      addAction: (input) => {
        const action: ActionT = { ...input, title: input.title.trim(), id: uuidv4(), createdAt: todayISO(), completedOn: null };
        set((s) => ({ actions: [action, ...s.actions] }));
        return action;
      },
      updateAction: (id, patch) =>
        set((s) => ({
          actions: s.actions.map((a) => {
            if (a.id !== id) return a;
            const next = { ...a, ...patch, title: (patch.title ?? a.title).trim() };
            if (next.repeat) next.completedOn = null;
            return next;
          }),
        })),
      deleteActions: (ids) =>
        set((s) => ({
          actions: s.actions.filter((a) => !ids.includes(a.id)),
          today: dropFromPlan(s.today, ids),
          tomorrow: dropFromPlan(s.tomorrow, ids),
          carryOver: s.carryOver.filter((id) => !ids.includes(id)),
        })),
      clearActions: () =>
        set((s) => ({
          actions: [],
          today: dropFromPlan(s.today, s.today.actionIds),
          tomorrow: dropFromPlan(s.tomorrow, s.tomorrow.actionIds),
          carryOver: [],
        })),

      setPriority: (day, id, priority) =>
        set((s) => {
          const plan = s[day];
          if (plan.finalized) return {};
          const actionIds = plan.actionIds.includes(id) ? plan.actionIds : [...plan.actionIds, id];
          return { [day]: { ...plan, actionIds, priorities: { ...plan.priorities, [id]: priority } } };
        }),
      removeFromPlan: (day, id) => set((s) => (s[day].finalized ? {} : { [day]: dropFromPlan(s[day], [id]) })),
      setFocus: (day, focus) => set((s) => ({ [day]: { ...s[day], focus } })),

      // Going over the time limit clears the selection on purpose: it forces a re-think of the day.
      finalizeToday: (maxMinutes) => {
        const { today, actions } = get();
        if (today.actionIds.length === 0) return { ok: false, message: "Add at least one action to your plan first" };
        if (planMinutes(today, actions) > maxMinutes) {
          set({ today: { ...today, actionIds: [], priorities: {}, completedIds: [] } });
          return { ok: false, message: "There isn't enough time in the day for all those actions. The plan has been cleared, let's try again." };
        }
        set({ today: { ...today, finalized: true } });
        return { ok: true };
      },
      editToday: () => set((s) => ({ today: { ...s.today, finalized: false } })),
      clearPlan: (day) => set((s) => ({ [day]: emptyPlan(s[day].date) })),

      toggleComplete: (id) =>
        set((s) => {
          const done = s.today.completedIds.includes(id);
          return {
            today: { ...s.today, completedIds: done ? s.today.completedIds.filter((x) => x !== id) : [...s.today.completedIds, id] },
            actions: s.actions.map((a) => (a.id === id && !a.repeat ? { ...a, completedOn: done ? null : s.today.date } : a)),
          };
        }),

      acceptCarryOver: () =>
        set((s) => {
          const ids = s.carryOver.filter((id) => s.actions.some((a) => a.id === id && !a.completedOn) && !s.today.actionIds.includes(id));
          const priorities = { ...s.today.priorities };
          ids.forEach((id) => (priorities[id] = priorities[id] || 1));
          return { carryOver: [], today: { ...s.today, finalized: false, actionIds: [...s.today.actionIds, ...ids], priorities } };
        }),
      dismissCarryOver: () => set({ carryOver: [] }),
    }),
    {
      name: DATA_KEY,
      version: STORE_VERSION,
      storage: createJSONStorage(() => AsyncStorage),
      skipHydration: true,
      partialize: ({ areas, actions, today, tomorrow, history, carryOver }) => ({ areas, actions, today, tomorrow, history, carryOver }),
    },
  ),
);

export const pickData = ({ areas, actions, today, tomorrow, history, carryOver }: DataT): DataT => ({ areas, actions, today, tomorrow, history, carryOver });
