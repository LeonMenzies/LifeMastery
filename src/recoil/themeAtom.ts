import { atom } from "recoil";
import { ThemeT } from "~types/Types";

export const lightTheme: ThemeT = {
  primary: "#FFC10C",
  secondary: "#ffe79e",
  background: "#FFFFFF",
  backgroundSecondary: "#e6e6e6",
  textPrimary: "#000000",
  textSecondary: "#6e6e6e",
  black: "#000000",
  white: "#ffffff",
  lightGrey: "#e5e5e5",
  grey: "#828282",
  error: "#900000",
  success: "#009000",
};

export const darkTheme: ThemeT = {
  primary: "#FFC10C",
  secondary: "#ffe79e",
  background: "#4d4d4d",
  backgroundSecondary: "#535353",
  textPrimary: "#ffffff",
  textSecondary: "#000000",
  black: "#000000",
  white: "#ffffff",
  lightGrey: "#dadada",
  grey: "#b1b1b1",
  error: "#cc0000",
  success: "#00bb00",
};

export const themeAtom = atom<ThemeT>({
  key: "theme",
  default: lightTheme,
});
