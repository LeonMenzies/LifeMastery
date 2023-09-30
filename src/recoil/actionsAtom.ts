import { atom } from "recoil";

import { actionItemT } from "~types/Types";

export const actionsAtom = atom({
  key: "actions",
  default: [] as actionItemT[],
});
