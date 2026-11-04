// ==========================================
// 1. Export TYPES (stripped out during build)
// ==========================================
export type { 
  FinancialCalculatorProps, 
  CalculatorInput, 
  CalculatorResult, 
  CalculatorTableData 
} from "./schema";

// ==========================================
// 2. Export VALUES (included in the bundle)
// ==========================================
export { calculatorInputSchema } from "./schema";
export { FinancialCalculator } from "./FinancialCalculator";

// Optional: Export the pure math helpers so developers can use them standalone
export { calculateEmi, generateAmortizationSchedule } from "./emiHelpers";