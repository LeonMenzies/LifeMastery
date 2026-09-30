import { create } from "zustand";

import { PlanT } from "~types/Types";

type PlanStoreT = {
  plan: PlanT;
  setPlan: (plan: PlanT | ((prev: PlanT) => PlanT)) => void;
};

export const usePlanStore = create<PlanStoreT>((set) => ({
  plan: {
    key: "",
    date: "",
    finalized: false,
    complete: false,
    actionKeys: [],
  },
  setPlan: (plan) => set((state) => ({ plan: typeof plan === "function" ? plan(state.plan) : plan })),
}));
