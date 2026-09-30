import { create } from "zustand";
import { ActionItemT } from "~types/Types";

export const emptyAction = {
  key: "",
  action: "",
  isCompleted: false,
  timeEstimate: 0,
  priority: 0,
  areaOfImportance: "",
  repeat: false,
  dateAdded: new Date().toLocaleDateString(),
} as ActionItemT;

type CreateActionStoreT = {
  action: ActionItemT;
  setAction: (action: ActionItemT) => void;
};

export const useCreateActionStore = create<CreateActionStoreT>((set) => ({
  action: emptyAction,
  setAction: (action) => set({ action }),
}));
