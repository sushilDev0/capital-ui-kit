import { describe, expect, it } from "vitest";
import { generateCode } from "./codegen";

function ok(layout: unknown, options?: Parameters<typeof generateCode>[1]) {
  const result = generateCode(layout, options);
  if (!result.ok) throw new Error(result.error);
  return result;
}

describe("generateCode", () => {
  it("imports each used component once and prints only the provided props", () => {
    const { code } = ok({
      sections: [
        { component: "CurrencyCounter", props: { value: 100, label: "A" } },
        { component: "CurrencyCounter", props: { value: 200 } },
      ],
    });
    expect(code.match(/import \{ CurrencyCounter \}/g)).toHaveLength(1);
    expect(code).toContain("value={100}");
    expect(code).toContain('label="A"');
    expect(code).not.toContain('currency="INR"'); // default, not provided
  });

  it("prints true booleans as bare attributes", () => {
    const { code } = ok({
      sections: [{ component: "PrivacyBadge", props: { value: "1234 5678", revealable: true } }],
    });
    expect(code).toMatch(/\brevealable\b(?!=)/);
  });
<<<<<<< HEAD

=======
>>>>>>> ce5ab90 (Revert "added App.tsx package and lock files , generate.ts and privacyBage component update")
  it("adds a TODO placeholder for callback props", () => {
    const { code } = ok({
      sections: [{ component: "DebouncedSearch", props: { delay: 400 } }],
    });
    expect(code).toContain("onSearch={");
    expect(code).toContain("TODO");
  });

  it("skips unknown or invalid sections and reports them", () => {
    const result = ok({
      sections: [
        { component: "NotAComponent", props: {} },
        { component: "CurrencyCounter", props: { value: 1 } },
      ],
    });
    expect(result.skipped).toHaveLength(1);
    expect(result.code).not.toContain("NotAComponent");
    expect(result.code).toContain("<CurrencyCounter");
  });

  it("returns an error when nothing is valid", () => {
    const result = generateCode({ sections: [{ component: "NotAComponent", props: {} }] });
    expect(result.ok).toBe(false);
  });

  it("escapes special characters in string props", () => {
    const { code } = ok({
      sections: [{ component: "CurrencyCounter", props: { value: 1, label: 'Rate "A" & <b>' } }],
    });
    expect(code).toContain('label={"Rate \\"A\\" & <b>"}');
  });

  it("uses the importBase and exportName options", () => {
    const { code } = ok(
      { sections: [{ component: "CurrencyCounter", props: { value: 1 } }] },
      { importBase: "./components", exportName: "Home" },
    );
    expect(code).toContain('from "./components/CurrencyCounter"');
    expect(code).toContain("export default function Home()");
  });

  it("reports dependencies and requirements for the used components", () => {
    const result = ok({
      sections: [{ component: "CurrencyCounter", props: { value: 1 } }],
    });
    expect(result.dependencies).toContain("motion");
    expect(result.requires).toContain("tailwindcss");
  });
});
