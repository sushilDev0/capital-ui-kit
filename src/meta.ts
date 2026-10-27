import type { ZodType } from "zod";
import { currencyCounterSchema } from "./components/CurrencyCounter/schema";
import { privacyBadgeSchema } from "./components/PrivacyBadge/schema";
import { debouncedSearchSchema } from "./components/DebouncedSearch/schema";

export type ComponentMeta = {
  schema: ZodType;
  description: string;
  dependencies: string[]; // npm packages the component needs
  requires: string[]; // things the target project must already have
  runtimeProps: string[]; // props the developer wires up, not the model
};

export const componentMeta = {
  CurrencyCounter: {
    schema: currencyCounterSchema,
    description:
      "Animated currency amount with an optional caption and a percentage trend badge. Use for balances and totals.",
    dependencies: ["motion", "lucide-react", "zod", "clsx", "tailwind-merge"],
    requires: ["tailwindcss"],
    runtimeProps: [],
  },
  PrivacyBadge: {
    schema: privacyBadgeSchema,
    description:
      "Masked sensitive number (card or account) with an optional reveal button. The value is a placeholder; real data is supplied at runtime.",
    dependencies: ["motion", "lucide-react", "zod", "clsx", "tailwind-merge"],
    requires: ["tailwindcss"],
    runtimeProps: [],
  },
  DebouncedSearch: {
    schema: debouncedSearchSchema,
    description:
      "Search input with debounce, minimum characters, a loading spinner and a Cmd/Ctrl+K shortcut.",
    dependencies: ["motion", "lucide-react", "zod", "clsx", "tailwind-merge"],
    requires: ["tailwindcss"],
    runtimeProps: ["onSearch", "isLoading"],
  },
} satisfies Record<string, ComponentMeta>;

export type ComponentName = keyof typeof componentMeta;