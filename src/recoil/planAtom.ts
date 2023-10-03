import { atom } from "recoil";
import { actionItemT } from "~types/Types";

export const planAtom = atom({
  key: "plan",
  default: {
    key: "",
    date: "",
    focus: "",
    finalized: false,
    actionItems: [] as actionItemT[],
  },
});
