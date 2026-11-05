import { componentMeta } from "./meta";
import { CurrencyCounter } from "./components/CurrencyCounter";
import { PrivacyBadge } from "./components/PrivacyBadge";
import { DebouncedSearch } from "./components/DebouncedSearch";
import StatusBadge from "./components/StatusBadge/StatusBadge";
import { StatCard } from "./components/StatCard/StatCard";
import { OmniInput } from "./components/OmniInput/OmniInput";
import { HoldToConfirmButton } from "./components/HoldToConfirmButton/HoldToConfirmButton";
import { PinInput } from "./components/PinInput/PinInput";

export const registry = {
  CurrencyCounter: { ...componentMeta.CurrencyCounter, component: CurrencyCounter },
  PrivacyBadge: { ...componentMeta.PrivacyBadge, component: PrivacyBadge },
  DebouncedSearch: { ...componentMeta.DebouncedSearch, component: DebouncedSearch },
  HoldToConfirmButton: {  ...componentMeta.HoldToConfirmButton,component: HoldToConfirmButton },
  StatusBadge: { ...componentMeta.StatusBadge, component: StatusBadge },
  StatCard: { ...componentMeta.StatCard, component: StatCard },
  OmniInput: {  ...componentMeta.OmniInput,component: OmniInput },
  PinInput: { ...componentMeta.PinInput, component: PinInput },

};