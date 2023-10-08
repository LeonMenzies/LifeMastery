import { atom } from "recoil";
import { ThemeT } from "~types/Types";

export const lightTheme: ThemeT = {
  primary: "#FFC10C",
  secondary: "#333333",
  background: "#FFFFFF",
  black: "#000000",
  white: "#ffffff",
  lightGrey: "#F5F5F5",
  grey: "#828282",
  error: "#900000",
  success: "#009000",
};

export const darkTheme: ThemeT = {
  primary: "#FFC10C",
  secondary: "#DDDDDD",
  background: "#333333",
  black: "#FFC10C",
  white: "#FFC10C",
  lightGrey: "#555555",
  grey: "#222222",
  error: "#900000",
  success: "#009000",
};

export const themeAtom = atom<ThemeT>({
  key: "theme",
  default: lightTheme,
});
