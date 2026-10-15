import type { ZodType} from "zod";
import { currencyCounterSchema } from "./components/CurrencyCounter/schema";
import { privacyBadgeSchema } from "./components/PrivacyBadge/schema";
import { debouncedSearchSchema } from "./components/DebouncedSearch/schema";

export type ComponnentMeta = {
    schema: ZodType;
    description:string;
    dependencies?: string[];
    runtimeProps?:string[];
    requires:string[];
};


export const componentMeta = {
    CurrencyCounter: {
        schema: currencyCounterSchema,
        description:"Animated currency amount with an optional cpation and a percentage trend badge. Use for balances and totals.",
        dependencies:["motion","lucide-react", "zod"],
        runtimeProps:[],
        requires:["tailwindcss"],

    },
   PrivacyBadge: {
    schema: privacyBadgeSchema,
    description:
      "Masked sensitive number (card or account) with an optional reveal button. The value is a placeholder; real data is supplied at runtime.",
    dependencies: ["motion", "lucide-react", "zod"],
    requires: ["tailwindcss"],
    runtimeProps: [],
  }, 
  DebouncedSearch: {
    schema: debouncedSearchSchema,
    description:
      "Search input with debounce, minimum characters, a loading spinner and a Cmd/Ctrl+K shortcut.",
    dependencies: ["motion", "lucide-react", "zod"],
    requires: ["tailwindcss"],
    runtimeProps: ["onSearch", "isLoading"],
  },
} satisfies Record<string, ComponnentMeta>;

export type ComponentName = keyof typeof componentMeta;
