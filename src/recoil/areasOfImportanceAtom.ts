import { atom } from "recoil";
import { AreaOfImportanceItemT } from "~types/Types";

export const areasOfImportanceAtom = atom({
  key: "areasOfImportance",
  default: [] as AreaOfImportanceItemT[],
});
