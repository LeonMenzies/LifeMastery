import { atom } from "recoil";

export const themeAtom = atom({
  key: "theme",
  default: {
    background: "#FFFFFF",
    primary: "#E1E1E1",
    secondary: "#BB86FC",
    primaryText: "#E1E1E1",
    secondaryText: "#2E2E2E",
  },
});

export const lightTheme = {
  background: "#FFFFFF",
  primary: "#E1E1E1",
  secondary: "#BB86FC",
  primaryText: "#E1E1E1",
  secondaryText: "#2E2E2E",
};

export const darkTheme = {
  background: "#2E2E2E",
  primary: "#E1E1E1",
  secondary: "#BB86FC",
  primaryText: "#E1E1E1",
  secondaryText: "#2E2E2E",
};
