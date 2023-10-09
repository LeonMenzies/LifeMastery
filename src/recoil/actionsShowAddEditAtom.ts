import { atom } from "recoil";
import { ActionItemT } from "~types/Types";

export const actionsShowAddEditAtom = atom({
  key: "actionsShowAddEdit",
  default: {
    show: false as boolean,
    action: {
      key: "",
      action: "",
      isCompleted: false,
      timeEstimate: 0,
      priority: 0,
      areaOfImportance: "",
      dateAdded: new Date().toISOString().split("T")[0],
    } as ActionItemT,
  },
});
