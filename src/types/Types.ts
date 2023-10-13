export type ActionItemT = {
  key: string;
  action: string;
  isCompleted: boolean;
  timeEstimate: number;
  priority: number;
  areaOfImportance: string;
  dateAdded: string;
};

export type AreaOfImportanceItemT = {
  key: string;
  AOI: string;
  Color: string;
};

export type PlanT = {
  key: string;
  date: string;
  focus: string;
  finalized: boolean;
  complete: boolean;
  actionKeys: string[];
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
