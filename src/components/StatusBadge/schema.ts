import { z } from "zod";

export const statusBadgeSchema = z.object({
  status: z
    .enum([
      // Financial states
      "paid", "pending", "failed", "refunded", "disputed", "authorized", "payout_sent",
      // Transit & Ride states
      "requested", "accepted", "arrived", "in_transit", "completed", "cancelled_by_driver",
      // Delivery & Logistics states
      "shipped", "delivered"
    ])
    .default("pending")
    .describe("The core status state to determine color, icon, and default label."),

  size: z
    .enum(["sm", "md", "lg"])
    .default("md")
    .describe("Responsive size scaling for the badge."),

  showIcon: z
    .boolean()
    .default(true)
    .describe("Toggle inline SVG icon visibility."),

  label: z
    .string()
    .max(40)
    .optional()
    .describe("Optional custom text override to replace the default status label."),

  theme: z
    .enum(["dark", "light"])
    .default("dark")
    .describe("Theme preference for color contrast adaptation."),

  color: z
    .enum([
      "auto",
      "emerald", "amber", "rose", "slate", "purple",
      "blue", "teal", "sky", "indigo",
    ])
    .default("auto")
    .describe(
      "Palette override. 'auto' (default) derives the color from `status`. " +
      "Any other value forces that palette regardless of status."
    ),
});

export type StatusBadgeProps = z.input<typeof statusBadgeSchema> & {
  className?: string;
};