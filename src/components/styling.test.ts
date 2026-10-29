import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CurrencyCounter } from "./CurrencyCounter";
import { PrivacyBadge } from "./PrivacyBadge";
import { DebouncedSearch } from "./DebouncedSearch";

const html = (el: React.ReactElement) => renderToStaticMarkup(el);

describe("className on the root", () => {
  it("CurrencyCounter keeps its default class and adds the consumer's", () => {
    const out = html(createElement(CurrencyCounter, { value: 100, className: "bg-red-900 text-red-200" }));
    expect(out).toContain("ui-currency-counter");
    expect(out).toContain("bg-red-900");
    expect(out).toContain("text-red-200");
  });

  it("PrivacyBadge keeps its default class and adds the consumer's", () => {
    const out = html(createElement(PrivacyBadge, { value: "1234567890123456", className: "bg-red-900 text-red-200" }));
    expect(out).toContain("ui-privacy-badge");
    expect(out).toContain("bg-red-900");
    expect(out).toContain("text-red-200");
  });

  it("DebouncedSearch keeps its default class and adds the consumer's", () => {
    const out = html(createElement(DebouncedSearch, { onSearch: () => {}, className: "max-w-md" }));
    expect(out).toContain("ui-search");
    expect(out).toContain("max-w-md");
  });
});

describe("theme and direction attributes", () => {
  it("CurrencyCounter sets data-theme and trend direction", () => {
    const out = html(createElement(CurrencyCounter, { value: 1, theme: "light", trendPercentage: -2 }));
    expect(out).toContain('data-theme="light"');
    expect(out).toContain('data-direction="down"');
  });
});