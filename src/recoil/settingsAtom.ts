import { atom } from "recoil";

export const settingsAtom = atom({
  key: "settings",
  default: {
    timePercent: true,
    lightMode: true,
  },
});
