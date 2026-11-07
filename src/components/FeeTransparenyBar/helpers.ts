import type { FeeItem, FeeTransparencyBarResult } from "./schema";

/**
 * Safely rounds to 2 decimal places.
 * Adding Number.EPSILON prevents classic JS float errors 
 * (e.g., ensures 1.005 correctly rounds to 1.01 instead of 1.00).
 */
function roundToTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function calculateFees(amount: number, fees: FeeItem[]): FeeTransparencyBarResult {
  let totalFees = 0;

  const breakdown = fees.map((fee) => {
    let calculatedAmount = 0;
    
    if (!fee.isFree) {
      calculatedAmount = fee.type === "percentage" 
        ? (amount * fee.value) / 100 
        : fee.value;
    }

    // Apply the safe rounding
    calculatedAmount = roundToTwo(calculatedAmount);
    totalFees += calculatedAmount;

    return { ...fee, amount: calculatedAmount };
  });

  const roundedTotalFees = roundToTwo(totalFees);
  const total = roundToTwo(amount + roundedTotalFees);

  return {
    subtotal: amount,
    totalFees: roundedTotalFees,
    total,
    breakdown,
  };
}

export function formatMoney(amount: number, currency: string, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    // Fallback if an invalid currency/locale is passed, preventing the whole UI from crashing
    console.warn(`Invalid currency or locale passed to formatMoney: ${currency}, ${locale}`);
    return `${currency} ${amount.toFixed(2)}`;
  }
}