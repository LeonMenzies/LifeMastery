// Dates are local ISO days ("YYYY-MM-DD"). Weekdays follow Date.getDay(): 0 = Sunday … 6 = Saturday.

export type AreaT = {
  id: string;
  name: string;
  color: string;
  weeklyTargetMinutes: number;
};

export type ActionT = {
  id: string;
  title: string;
  minutes: number;
  areaId: string | null;
  repeat: boolean;
  repeatDays: number[];
  createdAt: string;
  completedOn: string | null;
};

export type PlanT = {
  date: string;
  actionIds: string[];
  priorities: Record<string, number>;
  completedIds: string[];
  finalized: boolean;
  focus: string;
};

export type DayLogItemT = {
  id: string;
  title: string;
  areaId: string | null;
  minutes: number;
  priority: number;
  done: boolean;
};

export type DayLogT = {
  date: string;
  focus: string;
  finalized: boolean;
  items: DayLogItemT[];
};

export type DataT = {
  areas: AreaT[];
  actions: ActionT[];
  today: PlanT;
  tomorrow: PlanT;
  history: DayLogT[];
  carryOver: string[];
};

export type PlanDayT = "today" | "tomorrow";

export type ReminderT = {
  enabled: boolean;
  hour: number;
};

export type SettingsT = {
  appearance: "system" | "light" | "dark";
  progressBy: "time" | "tasks";
  maxPlanHours: number;
  suggestions: boolean;
  eveningReminder: ReminderT;
  morningReminder: ReminderT;
};

export type AlertT = {
  message: string;
  type: "info" | "error" | "success" | "warning";
};

export type ThemeT = {
  dark: boolean;
  background: string;
  surface: string;
  surfaceRaised: string;
  fill: string;
  border: string;
  text: string;
  textMuted: string;
  textFaint: string;
  accent: string;
  accentSoft: string;
  onAccent: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  backdrop: string;
};
