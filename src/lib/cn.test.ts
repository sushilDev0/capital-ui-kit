import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("lets a later Tailwind utility override an earlier one", () => {
    expect(cn("bg-slate-900/80", "bg-red-900")).toBe("bg-red-900");
  });

  it("keeps unrelated utilities", () => {
    expect(cn("p-4 text-sm", "text-lg")).toBe("p-4 text-lg");
  });

  it("ignores undefined and false values", () => {
    expect(cn("p-4", undefined, false, "m-2")).toBe("p-4 m-2");
  });
});
