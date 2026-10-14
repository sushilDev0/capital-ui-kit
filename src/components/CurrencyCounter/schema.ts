import { z } from "zod";

export const currencyCounterSchema = z.object({
  value: z.number().describe("Final amount to display"),
  currency: z.enum(["INR", "USD", "EUR", "GBP"]).default("INR"),
  locale: z
    .enum(["en-IN", "en-US", "en-GB", "de-DE"])
    .default("en-IN")
    .describe("Number formatting locale"),
  label: z.string().max(40).optional().describe("Small caption above the number"),
  trendPercentage: z
    .number()
    .min(-100)
    .max(1000)
    .optional()
    .describe("Change vs previous period, e.g. 12.5 or -3"),
  theme: z.enum(["dark", "light"]).default("dark"),
});

export type CurrencyCounterProps = z.input<typeof currencyCounterSchema>;