import { describe, expect, it } from "vitest";
import { validateLayout } from "./layout";

describe("validateLayout", () => {
  it("accepts a valid layout and fills in defaults", () => {
    const result = validateLayout({
      sections: [{ component: "CurrencyCounter", props: { value: 100 } }],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const section = result.sections[0];
    expect(section.ok).toBe(true);
    if (!section.ok) return;
    expect(section.props.currency).toBe("INR");
    expect(section.props.theme).toBe("dark");
  });

  it("keeps only the props that were actually provided in `input`", () => {
    const result = validateLayout({
      sections: [{ component: "CurrencyCounter", props: { value: 100, label: "Savings" } }],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const section = result.sections[0];
    if (!section.ok) throw new Error("section should be valid");
    expect(Object.keys(section.input).sort()).toEqual(["label", "value"]);
  });

  it("flags an unknown component but keeps the valid ones", () => {
    const result = validateLayout({
      sections: [
        { component: "NotAComponent", props: {} },
        { component: "PrivacyBadge", props: { value: "1234 5678" } },
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.sections[0].ok).toBe(false);
    expect(result.sections[1].ok).toBe(true);
  });

  it("flags invalid props with an error message", () => {
    const result = validateLayout({
      sections: [{ component: "CurrencyCounter", props: { value: 5, currency: "RUPEES" } }],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const section = result.sections[0];
    expect(section.ok).toBe(false);
    if (section.ok) return;
    expect(section.error.length).toBeGreaterThan(0);
  });

  it("rejects non-digit card values", () => {
    const result = validateLayout({
      sections: [{ component: "PrivacyBadge", props: { value: "abcd" } }],
    });
    expect(result.ok && result.sections[0].ok).toBe(false);
  });

  it("does not treat inherited object keys as components", () => {
    const result = validateLayout({
      sections: [
        { component: "constructor", props: {} },
        { component: "__proto__", props: {} },
        { component: "toString", props: {} },
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.sections.every((s) => !s.ok)).toBe(true);
  });

  it("rejects an empty layout", () => {
    expect(validateLayout({ sections: [] }).ok).toBe(false);
  });
<<<<<<< HEAD

=======
>>>>>>> ce5ab90 (Revert "added App.tsx package and lock files , generate.ts and privacyBage component update")
  it("rejects input that is not an object", () => {
    expect(validateLayout("hello").ok).toBe(false);
    expect(validateLayout(null).ok).toBe(false);
    expect(validateLayout(undefined).ok).toBe(false);
  });
});
