import { atom } from "recoil";

export const navigatorAtom = atom({
  key: "navigator",
  default: {
    show: false,
    page: "home",
  },
});
