import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { calculateGoalProgress, calculateTimeLeft, createMoneyFormatter } from "./helpers";

describe("calculateGoalProgress", () => {
  it("calculates standard progress correctly", () => {
    const result = calculateGoalProgress(500, 1000);
    expect(result.percentage).toBe(50);
    expect(result.remaining).toBe(500);
    expect(result.isComplete).toBe(false);
    expect(result.overfunded).toBe(0);
  });

  it("caps visual percentage at 100 but calculates overfunded amount", () => {
    const result = calculateGoalProgress(1200, 1000);
    expect(result.percentage).toBe(100); // UI should never exceed 100%
    expect(result.isComplete).toBe(true);
    expect(result.remaining).toBe(0);
    expect(result.overfunded).toBe(200);
  });

  it("handles zero target and zero saved safely (divide by zero prevention)", () => {
    const result = calculateGoalProgress(0, 0);
    expect(result.percentage).toBe(100);
    expect(result.isComplete).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it("handles zero target but positive saved amount", () => {
    const result = calculateGoalProgress(500, 0);
    expect(result.percentage).toBe(100);
    expect(result.isComplete).toBe(true);
    expect(result.overfunded).toBe(500);
  });
});

describe("calculateTimeLeft", () => {
  beforeEach(() => {
    // Freeze time to Nov 10, 2026
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-10T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns null if no date is provided", () => {
    expect(calculateTimeLeft(undefined, "en-US")).toBeNull();
  });

  it("returns 'Past due' for dates in the past", () => {
    const pastDate = new Date("2026-11-01T12:00:00Z");
    expect(calculateTimeLeft(pastDate, "en-US")).toBe("Past due");
  });

  it("formats days, months, and years correctly", () => {
    const in10Days = new Date("2026-11-20T12:00:00Z");
    expect(calculateTimeLeft(in10Days, "en-US")).toMatch(/in 10 days/);

    const in3Months = new Date("2027-02-10T12:00:00Z");
    expect(calculateTimeLeft(in3Months, "en-US")).toMatch(/in 3 months/);

    const in2Years = new Date("2028-11-10T12:00:00Z");
    expect(calculateTimeLeft(in2Years, "en-US")).toMatch(/in 2 years/);
  });
});

describe("createMoneyFormatter", () => {
  it("creates a USD formatter", () => {
    const format = createMoneyFormatter("USD", "en-US");
    expect(format(1500.5)).toBe("$1,500.50");
  });

  it("creates a zero-decimal currency formatter (JPY)", () => {
    const format = createMoneyFormatter("JPY", "ja-JP");
    expect(format(1500.5)).toMatch(/^￥1,501/); // Rounds to nearest whole yen
  });

  it("falls back gracefully on invalid currency codes", () => {
    const format = createMoneyFormatter("INVALID_CURRENCY", "en-US");
    expect(format(1500)).toBe("INVALID_CURRENCY 1500.00");
  });
});