export const DATA_KEY = "lifemastery-data";
export const SETTINGS_KEY = "lifemastery-settings";
export const STORE_VERSION = 2;

// v1 storage keys, read once by the migration and otherwise left alone
export const V1_KEYS = {
  actions: "action-list",
  areas: "aol-list",
  today: "today-plan",
  tomorrow: "tomorrow-plan",
  settings: "settings",
};

// Validated categorical order (CVD-separated) with a step tuned for dark surfaces. Assigned in order, never cycled.
export const AREA_COLORS = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#4a3aa7", "#e34948"];
export const AREA_COLORS_DARK: Record<string, string> = {
  "#2a78d6": "#3987e5",
  "#eb6834": "#d95926",
  "#1baf7a": "#199e70",
  "#eda100": "#c98500",
  "#e87ba4": "#d55181",
  "#008300": "#008300",
  "#4a3aa7": "#9085e9",
  "#e34948": "#e66767",
};
export const MAX_AREAS = AREA_COLORS.length;

// v1 assigned these in order; migration moves each slot onto the new palette
export const V1_AREA_COLORS = ["#0026D0", "#FFC20E", "#02A61D", "#38B6FF", "#CB6CE6", "#FF5757", "#A3FF72", "#FF914D", "#FDE404"];

export const STARTER_AREAS = ["Health", "Work", "Relationships", "Learning", "Home", "Finance", "Fun"];

export const MAX_TITLE_LENGTH = 80;
export const MAX_AREA_NAME_LENGTH = 30;
export const MAX_ACTION_MINUTES = 12 * 60;
export const MAX_PRIORITY = 9;
