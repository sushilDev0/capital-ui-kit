import { z } from "zod";

export const FeeItemSchema = z.object({
  id: z.string().optional(),
  label: z.string(),
  type: z.enum(["fixed", "percentage"]),
  // Required for math to work. Defaults to 0 to prevent NaN errors.
  value: z.number().nonnegative().default(0),
  // Used to render the green "Free" badge in the UI
  isFree: z.boolean().optional(),
  description: z.string().optional(),
});

export type FeeItem = z.infer<typeof FeeItemSchema>;

// Fixed typo: FeeTransparencyBarPropsSchema (was FreeTransparencyBar...)
export const FeeTransparencyBarPropsSchema = z.object({
  amount: z.number().nonnegative(),
  fees: z.array(FeeItemSchema),
  currency: z.string().default("USD"),
  locale: z.string().default("en-US"),
  variant: z.enum(["inline", "detailed", "marketing"]).default("detailed"),
  theme: z.enum(["dark", "light"]).default("dark"),
  className: z.string().optional(),
});

export type FeeTransparencyBarProps = z.infer<typeof FeeTransparencyBarPropsSchema> & {
  onChange?: (result: FeeTransparencyBarResult) => void;
};

export interface FeeTransparencyBarResult {
  // Fixed casing: subtotal (was subTotal) to match the helpers.ts output
  subtotal: number;
  totalFees: number;
  total: number;
  breakdown: Array<FeeItem & { amount: number }>;
}