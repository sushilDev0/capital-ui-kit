import type { SavingsGoalResult } from "./schema";

/**
 * Safely rounds to 2 decimal places.
 */
function roundToTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function calculateGoalProgress(
  savedAmount: number,
  targetAmount: number
): SavingsGoalResult {
  // Edge case: Zero target amount
  if (targetAmount === 0 && savedAmount === 0) {
    return { percentage: 100, isComplete: true, remaining: 0, overfunded: 0, timeLeft: null };
  }
  if (targetAmount === 0 && savedAmount > 0) {
    return { percentage: 100, isComplete: true, remaining: 0, overfunded: savedAmount, timeLeft: null };
  }

  const isComplete = savedAmount >= targetAmount;
  const remaining = Math.max(0, roundToTwo(targetAmount - savedAmount));
  const overfunded = Math.max(0, roundToTwo(savedAmount - targetAmount));
  
  const rawPercentage = (savedAmount / targetAmount) * 100;
  const percentage = Math.min(100, roundToTwo(rawPercentage));

  return {
    percentage,
    isComplete,
    remaining,
    overfunded,
    timeLeft: null,
  };
}

export function calculateTimeLeft(
  targetDate: string | Date | undefined,
  locale: string
): string | null {
  if (!targetDate) return null;
  
  const date = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  if (isNaN(date.getTime())) return null;

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const diffMs = date.getTime() - Date.now();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Past due";
  
  if (Math.abs(diffDays) < 30) return rtf.format(diffDays, "day");
  
  const diffMonths = Math.round(diffDays / 30);
  if (Math.abs(diffMonths) < 12) return rtf.format(diffMonths, "month");
  
  return rtf.format(Math.round(diffMonths / 12), "year");
}

/**
 * Creates a cached Intl.NumberFormat instance.
 * Prevents expensive re-instantiation on every render.
 */
export function createMoneyFormatter(currency: string, locale: string) {
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    });
    return (amount: number) => formatter.format(amount);
  } catch {
    // Fallback for invalid currency codes
    return (amount: number) => `${currency} ${amount.toFixed(2)}`;
  }
}