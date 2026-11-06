// split-bill/index.ts
// Public surface only. Everything here is safe to import.

export { SplitBill, default } from './SplitBill';

export type {
  SplitBillProps,
  SplitBillState,
  SplitBillResult,
  SplitMode,
  AmountMode,
  Person,
  BillItem,
  PersonShare,
  SplitBillTotals,
  ValidationIssue,
  ValidationCode,
} from './schema';

export { createInitialState, splitBillReducer } from './reducer';
export type { SplitBillAction } from './reducer';

export {
  calculate,
  parseMoney,
  parsePercent,
  formatMoney,
  formatBasisPoints,
  toMajorString,
  splitEvenly,
  allocateProportionally,
  resolveCurrency,
  CURRENCIES,
} from './helpers';
export type { CurrencyConfig, ParseResult } from './helpers';

export { PersonRow } from './components/PersonRow';
export { TipSelector } from './components/TipSelector';
export { Summary } from './components/Summary';
export { ItemsEditor } from './components/ItemsEditor';