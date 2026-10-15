import { componentMeta } from "./meta";
import { CurrencyCounter } from "./components/CurrencyCounter";
import { PrivacyBadge } from "./components/PrivacyBadge";
import { DebouncedSearch } from "./components/DebouncedSearch";

export const registry = {
  CurrencyCounter: { ...componentMeta.CurrencyCounter, component: CurrencyCounter },
  PrivacyBadge: { ...componentMeta.PrivacyBadge, component: PrivacyBadge },
  DebouncedSearch: { ...componentMeta.DebouncedSearch, component: DebouncedSearch },
};