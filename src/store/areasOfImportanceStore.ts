import { create } from "zustand";

import { AreaOfImportanceItemT } from "~types/Types";

type AreasOfImportanceStoreT = {
  areasOfImportance: AreaOfImportanceItemT[];
  setAreasOfImportance: (areasOfImportance: AreaOfImportanceItemT[]) => void;
};

export const useAreasOfImportanceStore = create<AreasOfImportanceStoreT>((set) => ({
  areasOfImportance: [],
  setAreasOfImportance: (areasOfImportance) => set({ areasOfImportance }),
}));
