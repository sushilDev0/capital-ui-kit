import { z } from "zod";
import { classString } from "../../lib/classString";

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
  classNames: z
    .object({
      root: classString.optional().describe("Card container, e.g. 'bg-red-900 border-red-700'"),
      label: classString.optional().describe("Caption text"),
      value: classString.optional().describe("The amount text, e.g. 'text-5xl text-red-300'"),
      trend: classString.optional().describe("The trend badge"),
    })
    .optional()
    .describe("Extra Tailwind classes per part. Use for colors, sizes and spacing requests."),
});

export type CurrencyCounterProps = z.input<typeof currencyCounterSchema> & { className?: string };