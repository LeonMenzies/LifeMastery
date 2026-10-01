import AsyncStorage from "@react-native-async-storage/async-storage";

import { DATA_KEY, SETTINGS_KEY } from "~utils/Constants";
import { V1DataT, migrateStorageIfNeeded, migrateV1 } from "~utils/Migration";

const v1Action = (key: string, patch: object = {}) => ({
  key,
  action: key,
  isCompleted: false,
  timeEstimate: 30,
  priority: 0,
  areaOfImportance: "Health",
  dateAdded: "30/09/2026",
  repeat: false,
  ...patch,
});

const v1: V1DataT = {
  areas: [
    { key: "h", AOI: "Health", Color: "#0026D0" },
    { key: "w", AOI: "Work", Color: "#123456" },
  ],
  actions: [
    v1Action("run-new", { action: "Run", repeat: true }),
    v1Action("run-old", { action: "Run", repeat: true, isCompleted: true }),
    v1Action("run-older", { action: "run ", repeat: true, isCompleted: true }),
    v1Action("email", { areaOfImportance: "Work", isCompleted: true, priority: 2 }),
    v1Action("orphan", { areaOfImportance: "" }),
    v1Action("old", { dateAdded: "garbage" }),
  ],
  today: { key: "", date: "30/09/2026", finalized: true, actionKeys: ["run-old", "email", "orphan"], focus: "Ship it" },
  tomorrow: { key: "", date: "1/10/2026", finalized: false, actionKeys: ["orphan"] },
  settings: { timePercent: false, lightMode: false, autoComplete: true, maxPlanTime: 10 },
};

describe("migrateV1", () => {
  const { data, settings } = migrateV1(v1, "2026-09-30", "DMY");

  it("links actions to areas by id and moves v1 colours onto the new palette", () => {
    expect(data.areas.map((a) => [a.id, a.name, a.color])).toEqual([
      ["h", "Health", "#2a78d6"],
      ["w", "Work", "#123456"],
    ]);
    expect(data.actions.find((a) => a.id === "email").areaId).toBe("w");
    expect(data.actions.find((a) => a.id === "orphan").areaId).toBeNull();
  });

  it("folds repeat copies into one template", () => {
    const runs = data.actions.filter((a) => a.title.trim().toLowerCase() === "run");
    expect(runs).toHaveLength(1);
    expect(runs[0]).toMatchObject({ id: "run-new", repeat: true, completedOn: null });
  });

  it("converts plans, mapping old repeat copies and keeping completion and priority", () => {
    expect(data.today).toEqual({
      date: "2026-09-30",
      actionIds: ["run-new", "email", "orphan"],
      priorities: { "run-new": 1, email: 2, orphan: 1 },
      completedIds: ["run-new", "email"],
      finalized: true,
      focus: "Ship it",
    });
    expect(data.tomorrow.date).toBe("2026-10-01");
    expect(data.actions.find((a) => a.id === "email").completedOn).toBe("2026-09-30");
  });

  it("parses locale dates and falls back to today", () => {
    expect(data.actions.find((a) => a.id === "orphan").createdAt).toBe("2026-09-30");
    expect(data.actions.find((a) => a.id === "old").createdAt).toBe("2026-09-30");
  });

  it("maps settings", () => {
    expect(settings).toMatchObject({ appearance: "dark", progressBy: "tasks", maxPlanHours: 10, suggestions: true });
  });

  it("copes with a completely empty v1 store", () => {
    const empty = migrateV1({ actions: null, areas: null, today: null, tomorrow: null, settings: null }, "2026-09-30", "MDY");
    expect(empty.data.actions).toEqual([]);
    expect(empty.data.today.date).toBe("2026-09-30");
  });
});

describe("migrateStorageIfNeeded", () => {
  beforeEach(() => AsyncStorage.clear());

  it("writes v2 data once and leaves v1 keys alone", async () => {
    await AsyncStorage.setItem("action-list", JSON.stringify(v1.actions));
    await AsyncStorage.setItem("aol-list", JSON.stringify(v1.areas));
    await migrateStorageIfNeeded();

    const stored = JSON.parse(await AsyncStorage.getItem(DATA_KEY));
    expect(stored.version).toBe(2);
    expect(stored.state.areas).toHaveLength(2);
    expect(JSON.parse(await AsyncStorage.getItem(SETTINGS_KEY)).state.settings.appearance).toBe("system");
    expect(await AsyncStorage.getItem("action-list")).not.toBeNull();

    await AsyncStorage.setItem("aol-list", "[]");
    await migrateStorageIfNeeded();
    expect(JSON.parse(await AsyncStorage.getItem(DATA_KEY)).state.areas).toHaveLength(2);
  });

  it("does nothing on a fresh install", async () => {
    await migrateStorageIfNeeded();
    expect(await AsyncStorage.getItem(DATA_KEY)).toBeNull();
  });
});
