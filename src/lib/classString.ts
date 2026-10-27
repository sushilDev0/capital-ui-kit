import { z } from "zod";

// Tailwind utility classes only. The pattern blocks quotes, braces, semicolons,
// angle brackets and url(...), so a model cannot smuggle in markup or remote images.
export const classString = z
  .string()
  .max(160)
  .regex(/^(?!.*url\s*\()[A-Za-z0-9\s:/.\-%[\]#(),_!+*]+$/i, {
    error: "Tailwind utility classes only",
  })
  .describe("Tailwind CSS v4 utility classes, e.g. 'bg-red-900 text-white'");
