import { create } from "zustand";

import { ActionItemT } from "~types/Types";

type ActionsStoreT = {
  actions: ActionItemT[];
  setActions: (actions: ActionItemT[]) => void;
};

export const useActionsStore = create<ActionsStoreT>((set) => ({
  actions: [],
  setActions: (actions) => set({ actions }),
}));
