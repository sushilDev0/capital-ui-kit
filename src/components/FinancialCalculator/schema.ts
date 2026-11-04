import { z } from "zod";

// The shape of a single input slider
export const calculatorInputSchema = z.object({
  id: z.string(),
  label: z.string(),
  min: z.number(),
  max: z.number(),
  step: z.number(),
  defaultValue: z.number(),
  prefix: z.string().optional(), // e.g., "₹"
  suffix: z.string().optional(), // e.g., "%" or "Yr"
});

export type CalculatorInput = z.infer<typeof calculatorInputSchema>;

export type CalculatorResult = {
  highlightValue: string; // The big EMI/SIP number
  highlightLabel: string;
  breakdown: { label: string; value: string; isWarning?: boolean }[];
};

export type CalculatorTableData = {
  columns: string[];
  rows: (string | number)[][];
};

export type FinancialCalculatorProps = {
  title: string;
  inputs: CalculatorInput[];
  currency: string;
  locale: string;
  theme?: "dark" | "light";
  className?: string;
  // 🚀 The Engine passes the current state to this function to do the math
  calculate: (values: Record<string, number>) => {
    result: CalculatorResult;
    table?: CalculatorTableData;
  };
};