import { ActionT, AreaT, DataT, DayLogT, PlanT } from "~types/Types";
import { addDays, startOfWeek } from "~utils/Dates";

export const emptyPlan = (date: string): PlanT => ({
  date,
  actionIds: [],
  priorities: {},
  completedIds: [],
  finalized: false,
  focus: "",
});

export const planActions = (plan: PlanT, actions: ActionT[]) => {
  const byId = new Map(actions.map((a) => [a.id, a]));
  return plan.actionIds.map((id) => byId.get(id)).filter(Boolean);
};

export const planMinutes = (plan: PlanT, actions: ActionT[]) => planActions(plan, actions).reduce((sum, a) => sum + a.minutes, 0);

export const planProgress = (plan: PlanT, actions: ActionT[], progressBy: "time" | "tasks") => {
  const items = planActions(plan, actions);
  const done = items.filter((a) => plan.completedIds.includes(a.id));
  const total = progressBy === "time" ? items.reduce((s, a) => s + a.minutes, 0) : items.length;
  const complete = progressBy === "time" ? done.reduce((s, a) => s + a.minutes, 0) : done.length;
  return {
    percent: total > 0 ? (complete / total) * 100 : 0,
    doneCount: done.length,
    totalCount: items.length,
    doneMinutes: done.reduce((s, a) => s + a.minutes, 0),
    totalMinutes: items.reduce((s, a) => s + a.minutes, 0),
  };
};

export const snapshotPlan = (plan: PlanT, actions: ActionT[]): DayLogT => ({
  date: plan.date,
  focus: plan.focus,
  finalized: plan.finalized,
  items: planActions(plan, actions).map((a) => ({
    id: a.id,
    title: a.title,
    areaId: a.areaId,
    minutes: a.minutes,
    priority: plan.priorities[a.id] || 0,
    done: plan.completedIds.includes(a.id),
  })),
});

const unfinished = (plan: PlanT, actions: ActionT[]) => planActions(plan, actions).filter((a) => !a.repeat && !a.completedOn && !plan.completedIds.includes(a.id)).map((a) => a.id);

// Moves the app onto `today`: archives the previous day, promotes tomorrow's plan
// and remembers unfinished actions so Home can offer to carry them over.
export const rollover = (data: DataT, today: string): DataT => {
  const tomorrow = addDays(today, 1);
  const prev = data.today;
  if (prev.date === today && data.tomorrow.date === tomorrow) return data;
  if (prev.date > today) return data;

  let history = data.history;
  let carry: string[] = prev.date === today ? data.carryOver : [];

  if (prev.date && prev.date < today) {
    if (prev.actionIds.length > 0) {
      history = [snapshotPlan(prev, data.actions), ...history.filter((h) => h.date !== prev.date)];
    }
    carry = unfinished(prev, data.actions);
  }

  let nextToday = prev.date === today ? prev : emptyPlan(today);
  let nextTomorrow = emptyPlan(tomorrow);
  const t = data.tomorrow;

  if (t.date === today && prev.date !== today) nextToday = t;
  else if (t.date === tomorrow) nextTomorrow = t;
  else if (t.date && t.date < today) carry = [...carry, ...unfinished(t, data.actions)];

  return {
    ...data,
    history,
    today: nextToday,
    tomorrow: nextTomorrow,
    carryOver: [...new Set(carry)].filter((id) => !nextToday.actionIds.includes(id)),
  };
};

export type AreaBalanceT = { areaId: string | null; minutes: number; targetMinutes: number };

export const weekBalance = (history: DayLogT[], today: PlanT, actions: ActionT[], areas: AreaT[]) => {
  const weekStart = startOfWeek(today.date);
  const days = [snapshotPlan(today, actions), ...history.filter((h) => h.date >= weekStart && h.date < today.date)];
  const minutes = new Map<string | null, number>();
  days.forEach((day) =>
    day.items.forEach((item) => {
      if (!item.done) return;
      const key = areas.some((a) => a.id === item.areaId) ? item.areaId : null;
      minutes.set(key, (minutes.get(key) || 0) + item.minutes);
    }),
  );
  const rows: AreaBalanceT[] = areas.map((a) => ({ areaId: a.id, minutes: minutes.get(a.id) || 0, targetMinutes: a.weeklyTargetMinutes }));
  if (minutes.get(null)) rows.push({ areaId: null, minutes: minutes.get(null), targetMinutes: 0 });
  return { weekStart, rows, totalMinutes: [...minutes.values()].reduce((s, m) => s + m, 0) };
};

const hasDone = (day: DayLogT | undefined) => !!day && day.items.some((i) => i.done);

// Consecutive days with at least one completed action, counting back from today
// (today only counts once something is done, so an unfinished morning doesn't break the streak).
export const streak = (history: DayLogT[], today: PlanT, actions: ActionT[]) => {
  const byDate = new Map(history.map((h) => [h.date, h]));
  let count = hasDone(snapshotPlan(today, actions)) ? 1 : 0;
  let date = addDays(today.date, -1);
  while (hasDone(byDate.get(date))) {
    count++;
    date = addDays(date, -1);
  }
  return count;
};

export const completionRate = (history: DayLogT[], today: string, days = 7) => {
  const from = addDays(today, -days);
  const recent = history.filter((h) => h.date >= from && h.date < today);
  const planned = recent.reduce((s, h) => s + h.items.length, 0);
  const done = recent.reduce((s, h) => s + h.items.filter((i) => i.done).length, 0);
  return planned > 0 ? (done / planned) * 100 : null;
};
