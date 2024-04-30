export type ActionItemT = {
  key: string;
  action: string;
  isCompleted: boolean;
  timeEstimate: number;
  priority: number;
  areaOfImportance: string;
  dateAdded: string;
  repeat: boolean;
};

export type AreaOfImportanceItemT = {
  key: string;
  AOI: string;
  Color: string;
};

export type AlertT = {
  message: string;
  type: "info" | "error" | "success" | "warning";
};

export type PlanT = {
  key: string;
  date: string;
  finalized: boolean;
  complete: boolean;
  actionKeys: string[];
};

export type SettingsT = {
  timePercent: boolean;
  lightMode: boolean;
  autoComplete: boolean;
  maxPlanTime: number;
};

export type ThemeT = {
  primary: string;
  secondary: string;
  background: string;
  backgroundSecondary: string;
  textPrimary: string;
  textSecondary: string;
  black: string;
  white: string;
  lightGrey: string;
  grey: string;
  error: string;
  success: string;
};
