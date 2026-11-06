export type SplitMode = "equal" | "amount" | "percent" | "item";
/** Whether a tip/tax value is expressed as a percentage or a fixed amount. */

export type AmountMode =  "percent" | "amount";

export interface Person {
    id:string;
    name:string;
    amount:string;
    percent:string;
}

export interface BillItem{
    id:string;
    name:string;
    amount:string;
    personIds:string[];
}

export interface SplitBillState{
    total:string;
    splitMode:SplitMode;
    tipMode:AmountMode;
    tipPercent:string;
    tipAmount:string;
    taxMode:AmountMode;
    taxPercent:string;
    taxAmount:string;
    people:Person[];
    items:BillItem[];
  /** @internal monotonic counter used to mint stable ids */
    seq:number;

}

export interface PersonShare{
    id:string;
    name:string;
      /** What this person owes, in minor units. Includes their tip and tax. */

    amount:number;
    subtotal:number;
    tip:number;
    tax:number;
}

export interface SplitBillTotals{
    subtotal:number;
    tip:number;
    tax:number;
    grandTotal:number;
}


export type ValidationCode =
  | 'no-people'
  | 'empty-name'
  | 'duplicate-name'
  | 'total-invalid'
  | 'empty-bill'
  | 'tip-invalid'
  | 'tax-invalid'
  | 'percent-invalid'
  | 'percent-sum'
  | 'amount-invalid'
  | 'amount-sum'
  | 'no-items'
  | 'item-invalid'
  | 'item-unassigned';

export interface ValidationIssue {
  code: ValidationCode;
  message: string;
  severity: 'error' | 'warning';
  personId?: string;
  itemId?: string;
}

export interface SplitBillResult {
  currency: string;
  splitMode: SplitMode;
  people: PersonShare[];
  totals: SplitBillTotals;
  isValid: boolean;
  issues: ValidationIssue[];
}
export interface SplitBillProps {
  /** ISO code: 'USD', 'INR', 'JPY' … Unknown codes fall back to 2 decimals. */
  currency?: string;
  /** Default tip percentage, e.g. 15. */
  defaultTip?: number;
  /** Initial people. Strings become names. */
  defaultPeople?: Array<string | { name: string }>;
  /** Which modes to offer, in order. */
  splitModes?: SplitMode[];
  /** Fires on mount and on every change with the derived result. */
  onChange?: (result: SplitBillResult) => void;
  className?: string;
  /** CSS custom properties, e.g. { '--sb-accent': '#e11d48' } */
  theme?: Record<string, string>;

  /* controlled usage */
  value?: SplitBillState;
  defaultValue?: SplitBillState;
  onStateChange?: (state: SplitBillState) => void;

  /* API-ready */
  initialValue?: Partial<SplitBillState>;
  onSubmit?: (result: SplitBillResult) => void | Promise<void>;
  isLoading?: boolean;
  error?: string | null;

  disabled?: boolean;
  /** Prefix for generated DOM ids. */
  idPrefix?: string;
  maxPeople?: number;
}