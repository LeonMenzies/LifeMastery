import { atom } from "recoil";

export const planAtom = atom({
  key: "plan",
  default: {
    key: "",
    date: "",
    finalized: false,
    complete: false,
    actionKeys: [] as string[],
  },
});
