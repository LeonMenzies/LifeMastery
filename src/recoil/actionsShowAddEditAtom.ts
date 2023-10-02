import { atom } from "recoil";
import { actionItemT } from "~types/Types";
import { v4 as uuidv4 } from "uuid";

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
      areaOfImportance: "None",
      dateAdded: new Date().toISOString().split("T")[0],
    } as actionItemT,
  },
});
