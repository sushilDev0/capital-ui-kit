import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { SavingsGoalTracker } from "./SavingsGoalTracker";

describe("SavingsGoalTracker", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the correct progress percentage", () => {
    // 🚀 Passed ALL required props based on the TypeScript error
    render(
      <SavingsGoalTracker 
        savedAmount={50} 
        targetAmount={100} 
        currency="USD"
        locale="en-US"
        variant="default"
        title="Savings Goal"
        theme="dark"
      />
    );
    
    expect(screen.getByText(/50%/)).toBeTruthy();
  });

  it("clamps progress at 100% if current exceeds goal", () => {
    render(
      <SavingsGoalTracker 
        savedAmount={150} 
        targetAmount={100} 
        currency="USD"
        locale="en-US"
        variant="default"
        title="Savings Goal"
        theme="dark"
      />
    );
    
    // Now the math works and the success state renders
    expect(screen.getByText("Goal Reached")).toBeTruthy();
    
    // Check the accessibility attribute
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar.getAttribute("aria-valuenow")).toBe("100");
  });
});