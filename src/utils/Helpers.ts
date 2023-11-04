import { PlanT } from "~types/Types";
import { COLORS, TOMORROW_PLAN } from "~utils/Constants";

export const generateAOIColor = (count: number) => {
  return count > 8 ? COLORS[0] : COLORS[count];
};

export const getDay = (date: Date) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return days[date.getDay()];
};

export const convertTime = (decimalHours: number): string => {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  return `${hours}:${minutes}`;
};

export const setPlanDateStringify = (plan: PlanT, day: string): string => {
  const today = new Date();
  if (day === TOMORROW_PLAN) {
    today.setDate(today.getDate() + 1);
  }
  return JSON.stringify({ ...plan, date: today.toISOString().split("T")[0] });
};
