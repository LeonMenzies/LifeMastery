import { atom } from "recoil";
import { ThemeT } from "~types/Types";

export const lightTheme: ThemeT = {
  primary: "#FFC10C",
  secondary: "#333333",
  background: "#FFFFFF",
  black: "#000000",
  white: "#ffffff",
  lightGrey: "#F5F5F5",
  darkGrey: "#666666",
  error: "#FF3333",
  success: "#33FF33",
};

export const darkTheme: ThemeT = {
  primary: "#FFC10C",
  secondary: "#DDDDDD",
  background: "#333333",
  black: "#FFC10C",
  white: "#FFC10C",
  lightGrey: "#555555",
  darkGrey: "#222222",
  error: "#FF3333",
  success: "#33FF33",
};

export const themeAtom = atom<ThemeT>({
  key: "theme",
  default: lightTheme,
});
