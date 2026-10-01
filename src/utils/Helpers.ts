import { ActionT, AreaT } from "~types/Types";
import { AREA_COLORS } from "~utils/Constants";
import { weekdayOf } from "~utils/Dates";

export const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

export const nextAreaColor = (areas: AreaT[]) => AREA_COLORS.find((color) => !areas.some((a) => a.color === color)) || AREA_COLORS[0];

export const isDueOn = (action: ActionT, iso: string) => action.repeat && (action.repeatDays.length === 0 || action.repeatDays.includes(weekdayOf(iso)));

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const describeRepeat = (action: Pick<ActionT, "repeat" | "repeatDays">) => {
  if (!action.repeat) return "";
  const days = [...action.repeatDays].sort();
  if (days.length === 0 || days.length === 7) return "Every day";
  if (days.join() === "1,2,3,4,5") return "Weekdays";
  if (days.join() === "0,6") return "Weekends";
  return days.map((d) => WEEKDAY_SHORT[d]).join(", ");
};

// Reorder the visible subset of ids while every hidden id keeps its slot.
export const reorderSubset = (allIds: string[], newVisibleOrder: string[]) => {
  const visible = new Set(newVisibleOrder);
  const queue = [...newVisibleOrder];
  return allIds.map((id) => (visible.has(id) ? queue.shift() : id));
};
