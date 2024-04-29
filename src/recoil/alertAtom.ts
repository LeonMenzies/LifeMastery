import { atom } from "recoil";
import { AlertT } from "~types/Types";

export const defaultAlert: AlertT = {
  message: "",
  type: "info",
};

export const alertAtom = atom({
  key: "alert",
  default: defaultAlert,
});
