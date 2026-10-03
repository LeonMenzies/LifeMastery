import { useColorScheme } from "react-native";

import { useSettingsStore } from "~store/settingsStore";
import { ThemeT } from "~types/Types";
import { AREA_COLORS_DARK } from "~utils/Constants";

// Brand colours (from the app icon): blue for identity and links, yellow for the main actions and progress
export const BRAND_BLUE = "#0327C7";
export const BRAND_YELLOW = "#FFC10C";

export const lightTheme: ThemeT = {
  dark: false,
  background: "#F3F4F8",
  surface: "#FFFFFF",
  surfaceRaised: "#FFFFFF",
  fill: "#E9EBF1",
  border: "#E1E4EB",
  text: "#12141C",
  textMuted: "#5E6475",
  textFaint: "#9BA0AE",
  accent: "#0327C7",
  accentSoft: "#E3E8FF",
  onAccent: "#FFFFFF",
  brand: BRAND_YELLOW,
  brandSoft: "#FFF3CC",
  onBrand: "#1F1600",
  hero: BRAND_BLUE,
  onHero: "#FFFFFF",
  success: "#15803D",
  successSoft: "#DCF5E4",
  warning: "#B45309",
  warningSoft: "#FDF0D5",
  danger: "#C81E1E",
  dangerSoft: "#FDE2E2",
  backdrop: "rgba(10, 12, 20, 0.4)",
};

export const darkTheme: ThemeT = {
  dark: true,
  background: "#0C0E14",
  surface: "#171A23",
  surfaceRaised: "#1F2330",
  fill: "#262B39",
  border: "#2A2F3E",
  text: "#F1F2F6",
  textMuted: "#A3A8B8",
  textFaint: "#6C7183",
  accent: "#7D8FFF",
  accentSoft: "#232A52",
  onAccent: "#0C0E14",
  brand: BRAND_YELLOW,
  brandSoft: "#3A2E06",
  onBrand: "#1F1600",
  hero: BRAND_BLUE,
  onHero: "#FFFFFF",
  success: "#4ADE80",
  successSoft: "#14301F",
  warning: "#FBBF24",
  warningSoft: "#3A2C0C",
  danger: "#F87171",
  dangerSoft: "#3B1717",
  backdrop: "rgba(0, 0, 0, 0.6)",
};

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 };

export const radius = { sm: 8, md: 12, lg: 16, xl: 22, pill: 999 };

export const type = {
  largeTitle: { fontSize: 32, fontWeight: "700" as const, letterSpacing: 0.2 },
  title: { fontSize: 22, fontWeight: "700" as const },
  headline: { fontSize: 17, fontWeight: "600" as const },
  body: { fontSize: 16, fontWeight: "400" as const },
  callout: { fontSize: 15, fontWeight: "400" as const },
  footnote: { fontSize: 13, fontWeight: "400" as const },
  caption: { fontSize: 12, fontWeight: "500" as const },
};

export const MAX_CONTENT_WIDTH = 680;

export const useTheme = (): ThemeT => {
  const system = useColorScheme();
  const appearance = useSettingsStore((s) => s.settings.appearance);
  const dark = appearance === "dark" || (appearance === "system" && system === "dark");
  return dark ? darkTheme : lightTheme;
};

// Translucent tint of an area colour for backgrounds
export const tint = (hex: string, alpha: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

export const useAreaColor = () => {
  const { dark } = useTheme();
  return (color: string | undefined) => (color ? (dark && AREA_COLORS_DARK[color]) || color : dark ? darkTheme.textFaint : lightTheme.textFaint);
};
