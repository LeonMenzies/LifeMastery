import { create } from "zustand";

import { PlanDayT } from "~types/Types";

export type TabT = "home" | "plan" | "actions" | "settings";

type UiStoreT = {
  tab: TabT;
  planDay: PlanDayT;
  actionSheet: { visible: boolean; editId: string | null };
  areasSheet: boolean;
  setTab: (tab: TabT) => void;
  openPlan: (day: PlanDayT) => void;
  setPlanDay: (day: PlanDayT) => void;
  openActionSheet: (editId?: string) => void;
  closeActionSheet: () => void;
  setAreasSheet: (visible: boolean) => void;
};

export const useUiStore = create<UiStoreT>((set) => ({
  tab: "home",
  planDay: "today",
  actionSheet: { visible: false, editId: null },
  areasSheet: false,
  setTab: (tab) => set({ tab }),
  openPlan: (planDay) => set({ tab: "plan", planDay }),
  setPlanDay: (planDay) => set({ planDay }),
  openActionSheet: (editId = null) => set({ actionSheet: { visible: true, editId } }),
  closeActionSheet: () => set((s) => ({ actionSheet: { ...s.actionSheet, visible: false } })),
  setAreasSheet: (areasSheet) => set({ areasSheet }),
}));
