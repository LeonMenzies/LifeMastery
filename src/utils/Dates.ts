const pad = (n: number) => n.toString().padStart(2, "0");

export const toISODate = (date: Date): string => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const parseISODate = (iso: string): Date => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const todayISO = (): string => toISODate(new Date());

export const addDays = (iso: string, days: number): string => {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + days);
  return toISODate(date);
};

export const weekdayOf = (iso: string): number => parseISODate(iso).getDay();

// Monday-based week start
export const startOfWeek = (iso: string): string => addDays(iso, -((weekdayOf(iso) + 6) % 7));

export const formatWeekday = (iso: string) => parseISODate(iso).toLocaleDateString(undefined, { weekday: "long" });

export const formatDayMonth = (iso: string) => parseISODate(iso).toLocaleDateString(undefined, { day: "numeric", month: "long" });

export const formatShortDate = (iso: string) => parseISODate(iso).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });

export type DateOrderT = "MDY" | "DMY" | "YMD";

// v1 stored dates with toLocaleDateString(), so the format depends on the device's region.
export const detectDateOrder = (format: (d: Date) => string = (d) => d.toLocaleDateString()): DateOrderT => {
  const parts: string[] = format(new Date(2001, 10, 23)).match(/\d+/g) || [];
  const day = parts.indexOf("23");
  const month = parts.indexOf("11");
  const year = parts.indexOf("2001");
  if (year === 0) return "YMD";
  if (day !== -1 && month !== -1 && day < month) return "DMY";
  return "MDY";
};

export const parseLocaleDate = (value: string, order: DateOrderT): string | null => {
  const parts = (value || "").match(/\d+/g);
  if (!parts || parts.length < 3) return null;
  const [a, b, c] = parts.map(Number);
  let y: number, m: number, d: number;

  if (parts[0].length === 4) [y, m, d] = [a, b, c];
  else if (a > 12) [d, m, y] = [a, b, c];
  else if (b > 12) [m, d, y] = [a, b, c];
  else if (order === "DMY") [d, m, y] = [a, b, c];
  else [m, d, y] = [a, b, c];

  if (y < 100) y += 2000;
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return toISODate(date);
};
