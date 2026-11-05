import { z } from "zod";
import React from "react";

// 1. Zod Schema (For AI Generation & Form Validation)
export const pinInputSchema = z.object({
  length: z.number().int().min(1).max(10).default(4).describe("The number of input boxes to render"),
  type: z.enum(["numeric", "alphanumeric"]).default("numeric").describe("The type of characters allowed"),
  variant: z.enum(["box", "mixed", "underlined"]).default("box").describe("The visual style of the input boxes"),
  size: z.enum(["sm", "md", "lg"]).optional().default("md").describe("The size of the input boxes"),
  value: z.string().optional().describe("Controlled value of the input"),
  defaultValue: z.string().optional().describe("Initial value for uncontrolled usage."),
  error: z.union([z.boolean(), z.string()]).optional().describe("Shows red borders and optional error text"),
  mask: z.boolean().optional().default(false).describe("If true, hides the digits like a password"),
  allowCopy: z.boolean().optional().default(false).describe("If true, allows the user to highlight and copy the text."),
  autoFocus: z.boolean().optional().default(false).describe("If true, the first input box will be focused on mount."),
  className: z.string().optional().describe("Additional class names to apply to the component"),
});

// 🚀 FIX: Use z.input so that properties with .default() are considered OPTIONAL
type ZodProps = z.input<typeof pinInputSchema>;

// 2. React Props Type
export type PinInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "onChange" | "value" | "defaultValue" | "autoFocus"> & 
  Omit<ZodProps, "onChange"> & {
    value?: string;
    defaultValue?: string;
    
    // Custom callbacks (Return the string value, not the HTML event)
    onChange?: (value: string) => void;
    onComplete?: (value: string) => void;
  };