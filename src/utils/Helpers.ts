import { COLORS } from "~utils/Constants";

export const generateAOIColor = (count: number) => {
  return count > 8 ? COLORS[0] : COLORS[count];
};

export const getDay = (date: Date) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return days[date.getDay()];
};

export const convertTime = (i: number) => {
  const hours = Math.floor(i);
  const decimalPart = i - hours;
  const minutes =
    decimalPart === 0.25 ? 15 : decimalPart === 0.5 ? 30 : decimalPart === 0.75 ? 45 : 0;

  return `${hours}:${minutes}`;
};
