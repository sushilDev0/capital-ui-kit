import { z } from "zod";

export const statCardSchema = z.object({
  title: z
    .string()
    .max(40)
    .describe("The main title of the KPI (e.g., 'Total Revenue')."),
    
  value: z
    .union([z.string(), z.number()])
    .describe("The main KPI value. Accepts string for pre-formatted numbers like '$1,000'."),
    
  delta: z
    .union([z.string(), z.number()])
    .optional()
    .describe("The change indicator (e.g., '+20.1%')."),
    
  trend: z
    .enum(["up", "down", "neutral"])
    .default("neutral")
    .describe("Drives color (green/red/gray) and the trend icon."),
    
  size: z
    .enum(["sm", "md", "lg"])
    .default("md")
    .describe("Responsive size scaling for the card padding and text."),
    
  theme: z
    .enum(["dark", "light"])
    .default("dark")
    .describe("Theme preference for color contrast adaptation."),
});

// Icon and className are React-specific, so they go here
export type StatCardProps = z.input<typeof statCardSchema> & {
  icon?: React.ReactNode;
  className?: string;
};