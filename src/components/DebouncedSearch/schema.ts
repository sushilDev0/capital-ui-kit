import { z } from "zod";
import type { InputHTMLAttributes } from "react";

export const debouncedSearchSchema = z.object({
  placeholder: z.string().max(60).default("Search assets or transactions...")
    .describe("Input placeholder text"),
  delay: z.number().int().min(0).max(2000).default(300)
    .describe("Debounce delay in milliseconds"),
  minChars: z.number().int().min(0).max(10).default(2)
    .describe("Minimum characters before a search runs"),
  enableShortcut: z.boolean().default(true)
    .describe("Focus the input with Cmd+K (Ctrl+K on Windows/Linux)"),
  theme: z.enum(["dark", "light"]).default("dark"),
});

// Props the model can set (used by the catalog and validator)
export type DebouncedSearchConfig = z.input<typeof debouncedSearchSchema>;

// Full component props: config + runtime props the developer wires up
export type DebouncedSearchProps = DebouncedSearchConfig & {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  className?: string;
} & Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "type" | "className" | "placeholder"
  >;