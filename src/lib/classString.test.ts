import { describe, expect, it } from "vitest";
import { classString } from "./classString";

const ok = (value: string) => classString.safeParse(value).success;

describe("classString", () => {
  it("accepts normal Tailwind classes", () => {
    expect(ok("bg-red-900 text-white")).toBe(true);
    expect(ok("hover:bg-red-800 md:text-lg")).toBe(true);
    expect(ok("w-1/2 bg-slate-900/80")).toBe(true);
    expect(ok("w-[137px] bg-[#0af] p-[calc(1rem_+_2px)] *:p-4")).toBe(true);
  });

  it("rejects markup, quotes and braces", () => {
    expect(ok('"><script>alert(1)</script>')).toBe(false);
    expect(ok("bg-red-900'; drop")).toBe(false);
    expect(ok("a{color:red}")).toBe(false);
    expect(ok("a;b")).toBe(false);
  });

  it("rejects remote images via url()", () => {
    expect(ok("bg-[url(https://evil.example/x.png)]")).toBe(false);
    expect(ok("bg-[URL (x)]")).toBe(false);
  });

  it("rejects empty and over-long values", () => {
    expect(ok("")).toBe(false);
    expect(ok("a".repeat(161))).toBe(false);
  });
});
