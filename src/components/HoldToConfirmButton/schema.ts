import { z } from "zod";
import type React from "react";

export const holdToConfirmButtonSchema = z.object({
  label: z.string().default("Hold to confirm"),
  holdDuration: z.number().min(0).default(1000),
  disabled: z.boolean().default(false),
  size: z.enum(["sm", "md", "lg"]).default("md"),
  variant: z.enum(["solid", "outline", "ghost"]).default("solid"),

  // 🚀 Semantic Themes + Custom Hex
  theme: z
    .enum(["primary", "success", "warning", "danger", "info", "neutral", "dark", "light"])
    .or(z.string())
    .default("primary")
    .describe("Semantic theme (e.g., 'danger', 'success') OR a custom CSS color (e.g., '#ff0000')."),
});

type NativeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>, 
  "onClick" | "disabled" | "className" | "children" | "onPointerDown" | "onPointerUp" | "onPointerLeave"
>;

export type HoldToConfirmButtonProps = z.input<typeof holdToConfirmButtonSchema> & 
  NativeButtonProps & {
    onConfirm: () => void;
    className?: string;
    children?: React.ReactNode; 
    icon?: React.ReactNode;
  };