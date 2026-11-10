import { z } from "zod";
import type { ReactNode } from "react";

export const SavingsGoalPropsSchema = z.object({
  targetAmount: z.number().nonnegative(),
  savedAmount: z.number().nonnegative(),
  currency: z.string().default("USD"),
  locale: z.string().default("en-US"),
  variant: z.enum(["default", "compact", "circular", "detailed"]).default("default"),
  title: z.string().default("Savings Goal"),
  targetDate: z.union([z.string(), z.date()]).optional(),
  theme: z.enum(["dark", "light"]).default("dark"),
  className: z.string().optional(),
});

// TS Type includes ReactNode slots that Zod can't validate
export type SavingsGoalProps = z.infer<typeof SavingsGoalPropsSchema> & {
  icon?: ReactNode;
  action?: ReactNode;
  renderFooter?: (result: SavingsGoalResult) => ReactNode;
  formatValue?: (amount: number) => string;
  onContribute?: () => void;
};

export interface SavingsGoalResult {
  percentage: number;
  isComplete: boolean;
  remaining: number;
  overfunded: number;
  timeLeft: string | null;
}