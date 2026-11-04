// ============================================================
// 1. Types for the Amortization Schedule
// ============================================================
export interface AmortizationRow {
  year: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  balance: number;
}

// ============================================================
// 2. The EMI Math Formula
// Formula: EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]
// ============================================================
export function calculateEmi(
  principal: number, 
  annualRate: number, 
  tenureMonths: number
): number {
  // If interest rate is 0%, simple division
  if (annualRate === 0) return principal / tenureMonths;
  
  const monthlyRate = annualRate / (12 * 100);
  const emi = 
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    
  return isFinite(emi) ? emi : 0;
}

// ============================================================
// 3. The Amortization Schedule Generator
// Aggregated by YEAR to prevent 360 DOM nodes for a 30-year loan
// ============================================================
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  tenureYears: number
): AmortizationRow[] {
  const monthlyRate = annualRate / (12 * 100);
  const tenureMonths = tenureYears * 12;
  const emi = calculateEmi(principal, annualRate, tenureMonths);
  
  let balance = principal;
  const schedule: AmortizationRow[] = [];

  let currentYearPrincipal = 0;
  let currentYearInterest = 0;

  for (let month = 1; month <= tenureMonths; month++) {
    const interest = balance * monthlyRate;
    const principalPaid = emi - interest;
    balance -= principalPaid;

    currentYearPrincipal += principalPaid;
    currentYearInterest += interest;

    // Push a row at the end of every 12 months (or the final month)
    if (month % 12 === 0 || month === tenureMonths) {
      schedule.push({
        year: Math.ceil(month / 12),
        principalPaid: Math.round(currentYearPrincipal),
        interestPaid: Math.round(currentYearInterest),
        totalPaid: Math.round(currentYearPrincipal + currentYearInterest),
        balance: Math.max(0, Math.round(balance)), // Prevent negative zero
      });
      currentYearPrincipal = 0;
      currentYearInterest = 0;
    }
  }
  
  return schedule;
}

// ============================================================
// 4. The Formatter (Used in the UI)
// ============================================================
export function formatCurrency(
  value: number, 
  locale: string = "en-IN", 
  currency: string = "INR"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}