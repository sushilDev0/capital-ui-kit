import { z } from "zod";
import { classString } from "../../lib/classString";

export const privacyBadgeSchema = z.object({
  value: z
    .string()
    .max(32)
    .regex(/^[0-9 -]+$/, { error: "Digits, spaces and dashes only" })
    .describe(
      "Placeholder number to display, e.g. '1234 5678 9012 3456'. Real data is supplied by the app at runtime.",
    ),
  label: z.string().max(40).optional().describe("Small caption shown with the badge, e.g. 'Card number'"),
  maskPattern: z
    .enum(["all", "last4", "first4"])
    .default("last4")
    .describe("Which digits stay visible: none, only the last 4, or only the first 4"),
  maskChar: z.enum(["•", "*"]).default("•"),
  revealable: z.boolean().default(false).describe("Show an eye button to reveal the number"),
  theme: z.enum(["dark", "light"]).default("dark"),
  classNames: z
    .object({
      root: classString.optional().describe("Card container, e.g. 'bg-red-900 border-red-700'"),
      label: classString.optional().describe("Caption text"),
      value: classString.optional().describe("The number text"),
    })
    .optional()
    .describe("Extra Tailwind classes per part. Use for colors, sizes and spacing requests."),
});

export type PrivacyBadgeProps = z.input<typeof privacyBadgeSchema> & { className?: string };