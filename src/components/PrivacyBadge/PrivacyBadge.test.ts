import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PrivacyBadge } from "./PrivacyBadge";
import { maskValue, describeMasked } from "./mask";

const html = (props: Parameters<typeof PrivacyBadge>[0]) =>
  renderToStaticMarkup(createElement(PrivacyBadge, props));

describe("PrivacyBadge masking", () => {
  it("shows only the last 4 by default and never leaks the rest", () => {
    const out = html({ value: "1234 5678 9012 3456" });
    expect(out).toContain("•••• •••• •••• 3456");
    expect(out).not.toContain("1234");
    expect(out).not.toContain("5678");
    expect(out).not.toContain("9012");
  });

  it("supports first4 and all patterns", () => {
    expect(html({ value: "1234567890123456", maskPattern: "first4" })).toContain("1234 •••• •••• ••••");
    const all = html({ value: "1234567890123456", maskPattern: "all" });
    expect(all).toContain("•••• •••• •••• ••••");
    expect(all).not.toContain("3456");
    expect(all).not.toContain("1234");
  });

  it("uses the chosen mask character", () => {
    expect(html({ value: "1234567890123456", maskChar: "*" })).toContain("**** **** **** 3456");
  });

  it("fully masks values of 4 characters or fewer", () => {
    const out = html({ value: "1234" });
    expect(out).toContain("••••");
    expect(out).not.toContain("1234");
  });

  it("handles letters, such as an IBAN, without dropping characters", () => {
    expect(maskValue("GB82WEST12345698765432", "last4", "•")).toBe("••••••••••••••••••5432");
    const out = html({ value: "GB82 WEST 1234 5698 7654 32" });
    expect(out).not.toContain("WEST");
    expect(out).toContain("••54 32"); // grouped in 4s from the left, like an IBAN
  });

  it("describes only the visible part to screen readers", () => {
    expect(describeMasked("1234567890123456", "last4")).toBe("Hidden, ending in 3 4 5 6");
    expect(describeMasked("1234567890123456", "first4")).toBe("Hidden, starting with 1 2 3 4");
    expect(describeMasked("1234567890123456", "all")).toBe("Hidden");
    expect(describeMasked("1234", "last4")).toBe("Hidden");
  });
});

describe("PrivacyBadge markup", () => {
  it("hides the visual value from assistive tech and announces a description instead", () => {
    const out = html({ value: "1234567890123456" });
    expect(out).toContain('aria-hidden="true"');
    expect(out).toContain('aria-live="polite"');
    expect(out).toContain("Hidden, ending in 3 4 5 6");
  });

  it("renders the toggle only when revealable", () => {
    expect(html({ value: "1234567890123456" })).not.toContain("<button");
    const out = html({ value: "1234567890123456", revealable: true });
    expect(out).toContain("<button");
    expect(out).toContain('aria-label="Show number"');
    expect(out).not.toContain("aria-pressed");
  });

  it("sets data-theme, defaulting to dark", () => {
    expect(html({ value: "1234567890123456" })).toContain('data-theme="dark"');
    expect(html({ value: "1234567890123456", theme: "light" })).toContain('data-theme="light"');
  });
});
