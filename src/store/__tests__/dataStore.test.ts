import { useDataStore } from "~store/dataStore";
import { todayISO } from "~utils/Dates";
import { emptyPlan } from "~utils/PlanLogic";

const store = () => useDataStore.getState();

beforeEach(() => {
  useDataStore.setState({ areas: [], actions: [], today: emptyPlan(todayISO()), tomorrow: emptyPlan(""), history: [], carryOver: [] });
});

const setup = () => {
  const area = store().addArea("Health");
  const a = store().addAction({ title: "Run", minutes: 300, areaId: area.id, repeat: false, repeatDays: [] });
  const b = store().addAction({ title: "Stretch", minutes: 60, areaId: area.id, repeat: true, repeatDays: [] });
  return { areaId: area.id, a, b };
};

describe("areas", () => {
  it("rejects duplicate names, allows renaming, and caps the count", () => {
    expect(store().addArea("Health").ok).toBe(true);
    expect(store().addArea(" health ")).toEqual({ ok: false, message: "You already have an area with that name" });
    const id = store().areas[0].id;
    expect(store().updateArea(id, { name: "Fitness" }).ok).toBe(true);
    expect(store().areas[0].name).toBe("Fitness");
    ["2", "3", "4", "5", "6", "7", "8"].forEach((n) => store().addArea(n));
    expect(store().addArea("9").ok).toBe(false);
  });

  it("keeps actions when their area is deleted", () => {
    const { areaId, a } = setup();
    store().deleteArea(areaId);
    expect(store().actions.find((x) => x.id === a.id).areaId).toBeNull();
  });
});

describe("planning", () => {
  it("clears the selection when finalizing over the time limit (on purpose)", () => {
    const { a, b } = setup();
    store().setPriority("today", a.id, 1);
    store().setPriority("today", b.id, 2);
    const result = store().finalizeToday(5 * 60);
    expect(result.ok).toBe(false);
    expect(store().today.actionIds).toEqual([]);
    expect(store().today.finalized).toBe(false);
  });

  it("finalizes within the limit and locks the picks", () => {
    const { a, b } = setup();
    store().setPriority("today", a.id, 2);
    store().setPriority("today", b.id, 1);
    expect(store().finalizeToday(16 * 60).ok).toBe(true);
    store().removeFromPlan("today", a.id);
    expect(store().today.actionIds).toEqual([a.id, b.id]);
    store().editToday();
    store().removeFromPlan("today", a.id);
    expect(store().today.actionIds).toEqual([b.id]);
  });

  it("completes repeats per day without cloning them", () => {
    const { a, b } = setup();
    store().setPriority("today", a.id, 1);
    store().setPriority("today", b.id, 1);
    store().toggleComplete(a.id);
    store().toggleComplete(b.id);
    expect(store().actions).toHaveLength(2);
    expect(store().actions.find((x) => x.id === a.id).completedOn).toBe(todayISO());
    expect(store().actions.find((x) => x.id === b.id).completedOn).toBeNull();
    expect(store().today.completedIds).toEqual([a.id, b.id]);
    store().toggleComplete(a.id);
    expect(store().actions.find((x) => x.id === a.id).completedOn).toBeNull();
  });

  it("removes deleted actions from plans and carry-over", () => {
    const { a } = setup();
    store().setPriority("tomorrow", a.id, 3);
    useDataStore.setState({ carryOver: [a.id] });
    store().deleteActions([a.id]);
    expect(store().tomorrow.actionIds).toEqual([]);
    expect(store().tomorrow.priorities).toEqual({});
    expect(store().carryOver).toEqual([]);
  });

  it("adds carried-over actions to today and reopens the plan", () => {
    const { a, b } = setup();
    store().setPriority("today", b.id, 1);
    store().finalizeToday(16 * 60);
    useDataStore.setState({ carryOver: [a.id] });
    store().acceptCarryOver();
    expect(store().today.actionIds).toEqual([b.id, a.id]);
    expect(store().today.finalized).toBe(false);
    expect(store().carryOver).toEqual([]);
  });
});
