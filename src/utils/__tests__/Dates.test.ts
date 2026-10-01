import { addDays, detectDateOrder, parseLocaleDate, startOfWeek, weekdayOf } from "~utils/Dates";

describe("detectDateOrder", () => {
  it("reads the device's day/month order from a sample date", () => {
    expect(detectDateOrder(() => "11/23/2001")).toBe("MDY");
    expect(detectDateOrder(() => "23/11/2001")).toBe("DMY");
    expect(detectDateOrder(() => "2001-11-23")).toBe("YMD");
    expect(detectDateOrder(() => "23.11.2001")).toBe("DMY");
  });
});

describe("parseLocaleDate", () => {
  it("parses NZ dates that new Date() can't", () => {
    expect(parseLocaleDate("30/09/2026", "DMY")).toBe("2026-09-30");
  });

  it("uses unambiguous values over the device order", () => {
    expect(parseLocaleDate("9/30/2026", "DMY")).toBe("2026-09-30");
    expect(parseLocaleDate("30/9/2026", "MDY")).toBe("2026-09-30");
  });

  it("falls back to the device order when ambiguous", () => {
    expect(parseLocaleDate("3/4/2026", "MDY")).toBe("2026-03-04");
    expect(parseLocaleDate("3/4/2026", "DMY")).toBe("2026-04-03");
  });

  it("handles ISO-like and junk input", () => {
    expect(parseLocaleDate("2026-09-30", "MDY")).toBe("2026-09-30");
    expect(parseLocaleDate("", "MDY")).toBeNull();
    expect(parseLocaleDate("31/02/2026", "DMY")).toBeNull();
  });
});

describe("date maths", () => {
  it("adds days across month boundaries", () => {
    expect(addDays("2026-09-30", 1)).toBe("2026-10-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("starts weeks on Monday", () => {
    expect(weekdayOf("2026-10-01")).toBe(4);
    expect(startOfWeek("2026-10-01")).toBe("2026-09-28");
    expect(startOfWeek("2026-10-04")).toBe("2026-09-28");
    expect(startOfWeek("2026-09-28")).toBe("2026-09-28");
  });
});
