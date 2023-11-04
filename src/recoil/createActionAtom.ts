import { atom } from "recoil";
import { ActionItemT } from "~types/Types";

export const emptyAction = {
  key: "",
  action: "",
  isCompleted: false,
  timeEstimate: 0,
  priority: 0,
  areaOfImportance: "",
  dateAdded: new Date().toISOString().split("T")[0],
} as ActionItemT;

export const createActionAtom = atom({
  key: "createActionAtom",
  default: emptyAction,
});
