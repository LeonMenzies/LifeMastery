import { AreaOfImportanceItemT, PlanT } from "~types/Types";
import { COLORS, TOMORROW_PLAN } from "~utils/Constants";

export const getAOIColor = (areaOfImportance: AreaOfImportanceItemT[]) => {
  const usedColors = areaOfImportance.map((item) => item.Color);
  return COLORS.find((color) => !usedColors.includes(color));
};

export const getDay = (date: Date) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return days[date.getDay()];
};

export const convertTime = (decimalMinutes: number): string => {
  const hours = Math.floor(decimalMinutes / 60);
  const minutes = decimalMinutes % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

export const setPlanDateStringify = (plan: PlanT, day: string): string => {
  const today = new Date();
  if (day === TOMORROW_PLAN) {
    today.setDate(today.getDate() + 1);
  }
  return JSON.stringify({ ...plan, date: today.toLocaleDateString() });
};
