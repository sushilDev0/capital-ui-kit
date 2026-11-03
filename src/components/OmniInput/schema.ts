import { z } from "zod";

export const omniInputSchema = z.object({
  value: z.number().nullable().default(null),
  
  // --- Domain Formatting ---
  format: z.enum(["currency", "decimal", "percent", "compact"]).default("currency").describe("The formatting engine to use."),
  locale: z.string().default("en-IN").describe("Controls comma grouping. Use 'en-US' for 1,000.00."),
  decimals: z.number().min(0).max(18).default(2).describe("Max decimals. 2 for fiat, 8 for crypto, 0 for marketing."),
  
  // --- Symbols & Affixes ---
  currency: z.string().default("INR").describe("ISO currency code used by Intl API."),
  symbol: z.string().optional().describe("Overrides the currency symbol. Use for crypto ('BTC') or stocks ('AAPL')."),
  symbolPosition: z.enum(["prefix", "suffix"]).default("prefix"),
  showSymbol: z.boolean().default(true),

  // --- Validation & Limits ---
  min: z.number().optional(),
  max: z.number().optional(),
  
  // --- UI & UX ---
  label: z.string().optional(),
  placeholder: z.string().default("0.00"),
  error: z.string().optional(),
  disabled: z.boolean().default(false),
  enableShortcuts: z.boolean().default(true).describe("Typing '1k' -> 1,000, '1m' -> 1,000,000."),
  presets: z.array(z.number()).optional(),
  
  id: z.string().optional(),
  name: z.string().optional(),
  theme: z.enum(["dark", "light"]).default("dark"),
  size: z.enum(["sm", "md", "lg", "xl"]).default("md"),
  variant: z.enum(["default", "ghost", "flushed"]).default("default"),
  align: z.enum(["left", "right"]).default("right"),
});

export type OmniInputProps = z.input<typeof omniInputSchema> & {
  onChange: (value: number | null) => void;
  className?: string;
  prefix?: React.ReactNode; 
  suffix?: React.ReactNode;
};