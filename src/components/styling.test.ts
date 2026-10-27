import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CurrencyCounter } from "./CurrencyCounter";
import { PrivacyBadge } from "./PrivacyBadge";
import { DebouncedSearch } from "./DebouncedSearch";
import { validateLayout } from "../layout";
import { catalog } from "../catalog";

describe("classNames slots", () => {
  it("CurrencyCounter: a red root replaces the default background", () => {
    const html = renderToStaticMarkup(
      createElement(CurrencyCounter, { value: 5, classNames: { root: "bg-red-900" } }),
    );
    expect(html).toContain("bg-red-900");
    expect(html).not.toContain("bg-slate-900/80");
    expect(html).toContain("rounded-2xl"); // unrelated classes survive
  });

  it("CurrencyCounter: styles the value and label separately", () => {
    const html = renderToStaticMarkup(
      createElement(CurrencyCounter, {
        value: 5,
        label: "Cash",
        classNames: { value: "text-red-300", label: "text-red-200" },
      }),
    );
    expect(html).toContain("text-red-300");
    expect(html).toContain("text-red-200");
    expect(html).not.toContain("text-slate-50");
  });

  it("CurrencyCounter: renders unchanged without classNames", () => {
    const html = renderToStaticMarkup(createElement(CurrencyCounter, { value: 5 }));
    expect(html).toContain("bg-slate-900/80");
  });

  it("PrivacyBadge: applies root and value classes", () => {
    const html = renderToStaticMarkup(
      createElement(PrivacyBadge, {
        value: "1234 5678 9012 3456",
        classNames: { root: "bg-red-900", value: "text-red-200" },
      }),
    );
    expect(html).toContain("bg-red-900");
    expect(html).not.toContain("bg-slate-900/80");
    expect(html).toContain("text-red-200");
  });

  it("PrivacyBadge: never prints the hidden digits", () => {
    const html = renderToStaticMarkup(
      createElement(PrivacyBadge, { value: "1234 5678 9012 3456", maskPattern: "all" }),
    );
    expect(html).not.toContain("3456");
  });

  it("DebouncedSearch: styles the input", () => {
    const html = renderToStaticMarkup(
      createElement(DebouncedSearch, {
        onSearch: () => {},
        classNames: { input: "bg-red-900" },
      }),
    );
    expect(html).toContain("bg-red-900");
    expect(html).not.toContain("bg-slate-900/80");
  });
});

describe("classNames in layouts and the catalog", () => {
  it("validateLayout accepts classNames", () => {
    const result = validateLayout({
      sections: [
        { component: "CurrencyCounter", props: { value: 5, classNames: { root: "bg-red-900" } } },
      ],
    });
    expect(result.ok && result.sections[0].ok).toBe(true);
  });

  it("validateLayout rejects unsafe classNames", () => {
    const result = validateLayout({
      sections: [
        { component: "CurrencyCounter", props: { value: 5, classNames: { root: "bg-[url(https://x.test/a.png)]" } } },
      ],
    });
    expect(result.ok && result.sections[0].ok).toBe(false);
  });

  it("every component advertises classNames to the model", () => {
    for (const entry of catalog) {
      const props = entry.props as { properties?: Record<string, unknown> };
      expect(props.properties?.classNames, entry.name).toBeDefined();
    }
  });
});
