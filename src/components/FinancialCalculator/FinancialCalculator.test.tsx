import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { FinancialCalculator } from "./FinancialCalculator";

describe("FinancialCalculator", () => {
  afterEach(() => {
    cleanup();
  });

  it("calls the calculate function and renders the result", () => {
    // 1. Mock the calculate function to return fake results
    const mockCalculate = vi.fn().mockReturnValue({
      result: {
        highlightLabel: "Monthly EMI",
        highlightValue: "$500",
        breakdown: [
          { label: "Principal", value: "$10,000" },
          { label: "Interest", value: "$1,000" }
        ],
      },
      table: {
        columns: ["Year", "Balance"],
        rows: [["Year 1", "$9,000"]],
      }
    });

    // 2. Render the component
    render(
      <FinancialCalculator
            title="Test Loan"
      
            inputs={[
                { id: "p", label: "Amount", min: 0, max: 1000, step: 10, defaultValue: 500 }
            ]}
            calculate={mockCalculate} currency={""} locale={"en-US"}      />
    );

    // 3. Verify the calculate function was called
    expect(mockCalculate).toHaveBeenCalled();

    // 4. Verify the results rendered to the screen
    // 🚀 Using toBeTruthy() instead of toBeInTheDocument() to avoid TS errors
    expect(screen.getByText("Monthly EMI")).toBeTruthy();
    expect(screen.getByText("$500")).toBeTruthy();
    expect(screen.getByText("Principal")).toBeTruthy();
    expect(screen.getByText("$10,000")).toBeTruthy();
    
    // Verify table rendered
    expect(screen.getByText("Year 1")).toBeTruthy();
  });
});