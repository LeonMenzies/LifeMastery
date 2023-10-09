import { atom } from "recoil";

import { ActionItemT } from "~types/Types";

export const actionsAtom = atom({
  key: "actions",
  default: [] as ActionItemT[],
});
