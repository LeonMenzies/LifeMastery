import { ActionT, DataT, PlanT } from "~types/Types";
import { isDueOn, reorderSubset } from "~utils/Helpers";
import { completionRate, emptyPlan, planProgress, rollover, streak, weekBalance } from "~utils/PlanLogic";

const action = (id: string, patch: Partial<ActionT> = {}): ActionT => ({
  id,
  title: id,
  minutes: 30,
  areaId: "health",
  repeat: false,
  repeatDays: [],
  createdAt: "2026-09-01",
  completedOn: null,
  ...patch,
});

const plan = (date: string, patch: Partial<PlanT> = {}): PlanT => ({ ...emptyPlan(date), ...patch });

const data = (patch: Partial<DataT>): DataT => ({
  areas: [{ id: "health", name: "Health", color: "#2a78d6", weeklyTargetMinutes: 120 }],
  actions: [],
  today: emptyPlan("2026-09-30"),
  tomorrow: emptyPlan("2026-10-01"),
  history: [],
  carryOver: [],
  ...patch,
});

describe("rollover", () => {
  it("does nothing on the same day", () => {
    const d = data({});
    expect(rollover(d, "2026-09-30")).toBe(d);
  });

  it("archives yesterday, promotes tomorrow's plan and offers unfinished actions", () => {
    const d = data({
      actions: [action("a"), action("b", { completedOn: "2026-09-30" }), action("r", { repeat: true }), action("t")],
      today: plan("2026-09-30", { actionIds: ["a", "b", "r"], completedIds: ["b"], finalized: true }),
      tomorrow: plan("2026-10-01", { actionIds: ["t"], priorities: { t: 1 } }),
    });
    const next = rollover(d, "2026-10-01");

    expect(next.history).toHaveLength(1);
    expect(next.history[0].date).toBe("2026-09-30");
    expect(next.history[0].items.map((i) => [i.id, i.done])).toEqual([
      ["a", false],
      ["b", true],
      ["r", false],
    ]);
    expect(next.today.date).toBe("2026-10-01");
    expect(next.today.actionIds).toEqual(["t"]);
    expect(next.tomorrow).toEqual(emptyPlan("2026-10-02"));
    // repeats aren't carried over, they come back on their own
    expect(next.carryOver).toEqual(["a"]);
  });

  it("starts fresh after a gap, carrying over the stale plans' leftovers", () => {
    const d = data({
      actions: [action("a"), action("t")],
      today: plan("2026-09-30", { actionIds: ["a"] }),
      tomorrow: plan("2026-10-01", { actionIds: ["t"] }),
    });
    const next = rollover(d, "2026-10-05");
    expect(next.today).toEqual(emptyPlan("2026-10-05"));
    expect(next.tomorrow).toEqual(emptyPlan("2026-10-06"));
    expect(next.carryOver).toEqual(["a", "t"]);
  });

  it("doesn't archive empty days and keeps an existing tomorrow plan", () => {
    const d = data({ today: emptyPlan(""), tomorrow: plan("2026-10-01", { actionIds: ["x"] }) });
    const next = rollover(d, "2026-09-30");
    expect(next.history).toEqual([]);
    expect(next.today.date).toBe("2026-09-30");
    expect(next.tomorrow.actionIds).toEqual(["x"]);
  });

  it("ignores a clock that went backwards", () => {
    const d = data({ today: plan("2026-10-03") });
    expect(rollover(d, "2026-10-01")).toBe(d);
  });
});

describe("progress and stats", () => {
  const actions = [action("a", { minutes: 60 }), action("b", { minutes: 30 }), action("c", { minutes: 30, areaId: "gone" })];
  const today = plan("2026-10-01", { actionIds: ["a", "b", "c"], completedIds: ["a", "c"] });

  it("counts by time or tasks", () => {
    expect(planProgress(today, actions, "time").percent).toBe((90 / 120) * 100);
    expect(planProgress(today, actions, "tasks").percent).toBe((2 / 3) * 100);
    expect(planProgress(emptyPlan("2026-10-01"), actions, "time").percent).toBe(0);
  });

  it("sums completed minutes per area for the week, including today", () => {
    const history = [
      { date: "2026-09-29", focus: "", finalized: true, items: [{ id: "x", title: "x", areaId: "health", minutes: 45, priority: 1, done: true }] },
      { date: "2026-09-27", focus: "", finalized: true, items: [{ id: "y", title: "y", areaId: "health", minutes: 99, priority: 1, done: true }] },
    ];
    const balance = weekBalance(history, today, actions, data({}).areas);
    expect(balance.weekStart).toBe("2026-09-28");
    expect(balance.rows).toEqual([
      { areaId: "health", minutes: 105, targetMinutes: 120 },
      { areaId: null, minutes: 30, targetMinutes: 0 },
    ]);
  });

  it("counts a streak of days with something done", () => {
    const done = (date: string) => ({ date, focus: "", finalized: true, items: [{ id: "x", title: "x", areaId: null, minutes: 5, priority: 1, done: true }] });
    const history = [done("2026-09-30"), done("2026-09-29"), done("2026-09-27")];
    expect(streak(history, today, actions)).toBe(3);
    expect(streak(history, plan("2026-10-01"), actions)).toBe(2);
    expect(completionRate(history, "2026-10-01")).toBe(100);
    expect(completionRate([], "2026-10-01")).toBeNull();
  });
});

describe("helpers", () => {
  it("knows which weekdays a repeat is due", () => {
    expect(isDueOn(action("r", { repeat: true }), "2026-10-01")).toBe(true);
    expect(isDueOn(action("r", { repeat: true, repeatDays: [1, 3] }), "2026-10-01")).toBe(false);
    expect(isDueOn(action("r", { repeat: true, repeatDays: [4] }), "2026-10-01")).toBe(true);
    expect(isDueOn(action("n"), "2026-10-01")).toBe(false);
  });

  it("reorders visible areas without moving hidden ones", () => {
    expect(reorderSubset(["a", "b", "c", "d"], ["d", "b"])).toEqual(["a", "d", "c", "b"]);
  });
});
