import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { FeeTransparencyBar } from "./FeeTransparencyBar";

describe("FeeTransparencyBar", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders a fixed fee correctly", () => {
    render(
      <FeeTransparencyBar 
        amount={100}
        fees={[
          { label: "Processing Fee", type: "fixed", value: 10 }
        ]}
        currency="USD"
        locale="en-US" variant={"inline"} theme={"dark"}      />
    );
    
    expect(screen.getByText("Processing Fee")).toBeTruthy();
    
    // 🚀 Looking for "$10.00" exactly as it appears in the DOM
    expect(screen.getByText("$10.00")).toBeTruthy();
  });

  it("renders a percentage fee correctly", () => {
    render(
      <FeeTransparencyBar 
        amount={200}
        fees={[
          { label: "Service Charge", type: "percentage", value: 2.5 }
        ]}
        currency="USD"
        locale="en-US" variant={"inline"} theme={"dark"}      />
    );
    
    // 🚀 Regex handles the "(2.5%)" text
    expect(screen.getByText(/Service Charge/)).toBeTruthy();
    
    // 🚀 Looking for "$5.00" exactly as it appears in the DOM
    expect(screen.getByText("$5.00")).toBeTruthy();
  });

  it("renders a free fee correctly", () => {
    render(
      <FeeTransparencyBar 
        amount={100}
        fees={[
          { label: "Network Fee", type: "fixed", value: 0, isFree: true }
        ]}
        currency="USD"
        locale="en-US" variant={"inline"} theme={"dark"}      />
    );
    
    expect(screen.getByText("Network Fee")).toBeTruthy();
    const freeText = screen.queryByText(/Free/i) || screen.queryByText("$0.00");
    expect(freeText).toBeTruthy();
  });
});