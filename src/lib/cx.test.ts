import { describe, it, expect } from "vitest";
import { cx } from "./cx";

describe("cx", () => {
  it("joins truthy class names", () => {
    expect(cx("a", "b")).toBe("a b");
  });
  it("drops false, null, undefined and empty strings", () => {
    expect(cx("a", false, null, undefined, "", "b")).toBe("a b");
  });
  it("keeps the consumer className last", () => {
    expect(cx("ui-button", "bg-red-500")).toBe("ui-button bg-red-500");
  });
});
