import { atom } from "recoil";
import { ActionItemT } from "~types/Types";

export const emptyAction = {
  key: "",
  action: "",
  isCompleted: false,
  timeEstimate: 0,
  priority: 0,
  areaOfImportance: "",
  repeat: {
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false,
  },
  dateAdded: new Date().toLocaleDateString(),
} as ActionItemT;

export const createActionAtom = atom({
  key: "createActionAtom",
  default: emptyAction,
});
