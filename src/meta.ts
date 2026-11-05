import type { ZodType } from "zod";
import { currencyCounterSchema } from "./components/CurrencyCounter/schema";
import { privacyBadgeSchema } from "./components/PrivacyBadge/schema";
import { debouncedSearchSchema } from "./components/DebouncedSearch/schema";
// 🚀 New Schemas
import { statusBadgeSchema } from "./components/StatusBadge/schema";
import { statCardSchema } from "./components/StatCard/schema";
import { omniInputSchema } from "./components/OmniInput/schema";
import { holdToConfirmButtonSchema} from "./components/HoldToConfirmButton/schema";
import { pinInputSchema } from "./components/PinInput/schema";

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
  
  // 🚀 NEW COMPONENTS (Plain CSS Architecture)
  
  HoldToConfirmButton: {
    schema: holdToConfirmButtonSchema,
    description:
      "Button that requires a long press (hold) to confirm high-stakes actions like deleting an account or transferring funds.",
    dependencies: ["zod"], // No motion needed, pure React/CSS
    requires: [], // Uses pure CSS
    runtimeProps: ["onConfirm"],
  },
  StatusBadge: {
    schema: statusBadgeSchema,
    description:
      "Consistent paid, pending, failed, refunded and transit states for transaction, invoice and order lists.",
    dependencies: ["zod"], // Uses inline SVGs, no lucide-react needed
    requires: [], // Uses pure CSS
    runtimeProps: [],
  },
  StatCard: {
    schema: statCardSchema,
    description:
      "KPI card with spring-animated rising numbers, trend deltas, icons, and a glassmorphism design.",
    dependencies: ["motion", "zod"],
    requires: [], // Uses pure CSS
    runtimeProps: [],
  },
  OmniInput: {
    schema: omniInputSchema,
    description:
      "Universal amount input for Fiat, Crypto, Stocks, and Marketing. Handles locale formatting, custom decimals, shortcuts (e.g., '1.5k'), and quick-fill presets.",
    dependencies: ["motion", "zod"],
    requires: [], // Uses pure CSS
    runtimeProps: ["onChange", "prefix", "suffix"],
  },
  PinInput: {
    schema: pinInputSchema,
    description:
      "A multi-box input for PINs, OTPs, or verification codes. Supports numeric and alphanumeric types, masking, and auto-focus.",
    dependencies: ["zod"],
    requires: [], // Uses pure CSS
    runtimeProps: ["onChange", "onComplete"],
  },  
 

} satisfies Record<string, ComponentMeta>;

export type ComponentName = keyof typeof componentMeta;