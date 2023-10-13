import { atom } from "recoil";

export const planAtom = atom({
  key: "plan",
  default: {
    key: "",
    date: "",
    focus: "",
    finalized: false,
    complete: false,
    actionKeys: [] as string[],
  },
});
