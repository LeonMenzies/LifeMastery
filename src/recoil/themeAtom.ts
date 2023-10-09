import { atom } from "recoil";
import { ThemeT } from "~types/Types";

export const lightTheme: ThemeT = {
  primary: "#FFC10C",
  secondary: "#333333",
  background: "#FFFFFF",
  black: "#000000",
  white: "#ffffff",
  lightGrey: "#e5e5e5",
  grey: "#828282",
  error: "#900000",
  success: "#009000",
};

export const darkTheme: ThemeT = {
  primary: "#FFC10C",
  secondary: "#565656",
  background: "#333333",
  black: "#000000",
  white: "#ffffff",
  lightGrey: "#595959",
  grey: "#464646",
  error: "#900000",
  success: "#009000",
};

export const themeAtom = atom<ThemeT>({
  key: "theme",
  default: lightTheme,
});
