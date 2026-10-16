import { describe, expect, it } from "vitest";
import { groupDigits, maskValue } from "./mask";

describe("groupDigits", () => {
  it("groups digits in fours", () => {
    expect(groupDigits("1234567890123456")).toBe("1234 5678 9012 3456");
  });

  it("handles input that already has spaces and dashes", () => {
    expect(groupDigits("1234-5678 9012")).toBe("1234 5678 9012");
  });

  it("returns an empty string for empty input", () => {
    expect(groupDigits("")).toBe("");
  });
});

describe("maskValue", () => {
  const card = "1234 5678 9012 3456";

  it("shows only the last 4 digits", () => {
    expect(maskValue(card, "last4", "•")).toBe("•••• •••• •••• 3456");
  });

  it("shows only the first 4 digits", () => {
    expect(maskValue(card, "first4", "•")).toBe("1234 •••• •••• ••••");
  });

  it("masks everything", () => {
    expect(maskValue(card, "all", "•")).toBe("•••• •••• •••• ••••");
  });

  it("uses the chosen mask character", () => {
    expect(maskValue(card, "last4", "*")).toBe("**** **** **** 3456");
  });

  it("masks short numbers completely so nothing leaks", () => {
    expect(maskValue("123", "last4", "•")).toBe("•••");
    expect(maskValue("1234", "first4", "•")).toBe("••••");
  });

  it("returns an empty string for empty input", () => {
    expect(maskValue("", "last4", "•")).toBe("");
  });
});
