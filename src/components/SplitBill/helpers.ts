// split-bill/helpers.ts
import type {
  PersonShare,
  SplitBillResult,
  SplitBillState,
  ValidationIssue,
} from './schema';

/* ------------------------------------------------------------------ */
/* Currency                                                            */
/* ------------------------------------------------------------------ */

export interface CurrencyConfig {
  code: string;
  symbol: string;
  /** 2 for USD/INR, 0 for JPY/KRW */
  decimals: number;
  locale?: string;
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', decimals: 2, locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', decimals: 2, locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', decimals: 2, locale: 'en-GB' },
  INR: { code: 'INR', symbol: '₹', decimals: 2, locale: 'en-IN' },
  JPY: { code: 'JPY', symbol: '¥', decimals: 0, locale: 'ja-JP' },
  KRW: { code: 'KRW', symbol: '₩', decimals: 0, locale: 'ko-KR' },
};

export function resolveCurrency(code = 'USD'): CurrencyConfig {
  return CURRENCIES[code] ?? { code, symbol: `${code} `, decimals: 2 };
}

/* ------------------------------------------------------------------ */
/* Parsing / formatting                                                */
/* ------------------------------------------------------------------ */

export interface ParseResult {
  /** minor units; null when the field is empty */
  value: number | null;
  /** present when the text cannot be parsed at all */
  error?: string;
}

const NUMERIC = /^\d*\.?\d*$/;

/**
 * Parse a user-typed major-unit string ("12.345") into integer minor units.
 * Digits beyond the currency precision are rounded half-up, never truncated
 * into float error.
 */
export function parseMoney(input: string, decimals: number): ParseResult {
  const raw = String(input ?? '').trim().replace(/[,\s]/g, '');
  if (raw === '') return { value: null };
  if (!NUMERIC.test(raw) || raw === '.') return { value: null, error: 'Enter a valid number.' };

  const [wholePart = '', fracPart = ''] = raw.split('.');
  const whole = wholePart === '' ? '0' : wholePart;
  if (whole.length > 15) return { value: null, error: 'That amount is too large.' };

  const factor = 10 ** decimals;
  const wholeMinor = Number(whole) * factor;
  if (!Number.isSafeInteger(wholeMinor)) return { value: null, error: 'That amount is too large.' };

  let minor = wholeMinor;
  if (decimals > 0) {
    const padded = (fracPart + '0'.repeat(decimals + 1)).slice(0, decimals + 1);
    minor += Number(padded.slice(0, decimals) || '0');
    if (Number(padded[decimals] ?? '0') >= 5) minor += 1;
  } else if (fracPart && Number(fracPart[0]) >= 5) {
    minor += 1;
  }
  return { value: minor };
}

/** Percentages are stored in basis points (1% = 100) so they can sum exactly. */
export function parsePercent(input: string): ParseResult {
  return parseMoney(input, 2);
}

export function formatBasisPoints(bp: number): string {
  const sign = bp < 0 ? '-' : '';
  const abs = Math.abs(bp);
  const whole = Math.floor(abs / 100);
  const frac = abs % 100;
  return frac === 0 ? `${sign}${whole}` : `${sign}${whole}.${String(frac).padStart(2, '0')}`;
}

export function formatMoney(minor: number, currency: CurrencyConfig): string {
  const value = minor / 10 ** currency.decimals;
  try {
    return new Intl.NumberFormat(currency.locale ?? 'en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: currency.decimals,
      maximumFractionDigits: currency.decimals,
    }).format(value);
  } catch {
    return `${currency.symbol}${value.toFixed(currency.decimals)}`;
  }
}

/** "1250" minor units + 2 decimals -> "12.50" (for round-tripping into inputs) */
export function toMajorString(minor: number, decimals: number): string {
  const factor = 10 ** decimals;
  const whole = Math.floor(minor / factor);
  const frac = minor % factor;
  return decimals === 0 ? String(whole) : `${whole}.${String(frac).padStart(decimals, '0')}`;
}

/* ------------------------------------------------------------------ */
/* Allocation primitives                                               */
/* ------------------------------------------------------------------ */

/**
 * Split `total` minor units into `n` whole shares that sum *exactly* to total.
 * Leftover units go to the first people, in a fixed, predictable order.
 */
export function splitEvenly(total: number, n: number): number[] {
  if (n <= 0) return [];
  const base = Math.floor(total / n);
  const remainder = total - base * n;
  return Array.from({ length: n }, (_, i) => base + (i < remainder ? 1 : 0));
}

/**
 * Distribute `amount` across `weights`. Sums exactly to `amount`.
 * Remainder goes by largest fractional part; ties break by index (stable).
 */
export function allocateProportionally(amount: number, weights: number[]): number[] {
  const n = weights.length;
  if (n === 0) return [];
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  if (totalWeight <= 0) return splitEvenly(amount, n);

  const raw = weights.map((w) => (amount * w) / totalWeight);
  const out = raw.map((v) => Math.floor(v));
  const remainder = amount - out.reduce((a, b) => a + b, 0);

  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac || a.i - b.i);

  for (let k = 0; k < remainder; k++) out[order[k % n].i] += 1;
  return out;
}

function mulDivRound(value: number, mul: number, div: number): number {
  return Math.round((value * mul) / div);
}

/* ------------------------------------------------------------------ */
/* The one calculation function                                        */
/* ------------------------------------------------------------------ */

export function calculate(state: SplitBillState, currency: CurrencyConfig): SplitBillResult {
  const issues: ValidationIssue[] = [];
  const decimals = currency.decimals;
  const people = state.people;
  const n = people.length;

  /* ---- people validation ---- */
  if (n === 0) {
    issues.push({ code: 'no-people', severity: 'error', message: 'Add at least one person.' });
  }
  const nameCounts = new Map<string, number>();
  for (const p of people) {
    const key = p.name.trim().toLowerCase();
    if (!key) {
      issues.push({
        code: 'empty-name',
        severity: 'warning',
        personId: p.id,
        message: 'Give this person a name.',
      });
    } else {
      nameCounts.set(key, (nameCounts.get(key) ?? 0) + 1);
    }
  }
  nameCounts.forEach((count, key) => {
    if (count > 1) {
      issues.push({
        code: 'duplicate-name',
        severity: 'warning',
        message: `More than one person is named "${key}".`,
      });
    }
  });

  /* ---- bill subtotal ---- */
  const totalParsed = parseMoney(state.total, decimals);
  if (totalParsed.error) {
    issues.push({ code: 'total-invalid', severity: 'error', message: 'Bill total must be a number.' });
  }

  let subtotal = totalParsed.value ?? 0;
  const itemAmounts: number[] = [];

  if (state.splitMode === 'item') {
    subtotal = 0;
    if (state.items.length === 0) {
      issues.push({ code: 'no-items', severity: 'warning', message: 'Add at least one item.' });
    }
    state.items.forEach((item) => {
      const parsed = parseMoney(item.amount, decimals);
      if (parsed.error) {
        issues.push({
          code: 'item-invalid',
          severity: 'error',
          itemId: item.id,
          message: 'Item amount must be a number.',
        });
      }
      const value = parsed.value ?? 0;
      itemAmounts.push(value);
      subtotal += value;
      if (item.personIds.length === 0 && value > 0) {
        issues.push({
          code: 'item-unassigned',
          severity: 'warning',
          itemId: item.id,
          message: `"${item.name || 'Item'}" has nobody assigned — it will be split evenly.`,
        });
      }
    });
  }

  if (subtotal <= 0 && !totalParsed.error && state.splitMode !== 'item') {
    issues.push({ code: 'empty-bill', severity: 'error', message: 'Enter a bill amount greater than zero.' });
  }
  if (subtotal <= 0 && state.splitMode === 'item' && state.items.length > 0) {
    issues.push({ code: 'empty-bill', severity: 'error', message: 'Add at least one item with an amount.' });
  }

  /* ---- tip ---- */
  let tipAmount = 0;
  if (state.tipMode === 'percent') {
    const parsed = parsePercent(state.tipPercent);
    if (parsed.error) {
      issues.push({ code: 'tip-invalid', severity: 'error', message: 'Tip percentage must be a number.' });
    }
    tipAmount = mulDivRound(subtotal, Math.max(0, parsed.value ?? 0), 10000);
  } else {
    const parsed = parseMoney(state.tipAmount, decimals);
    if (parsed.error) {
      issues.push({ code: 'tip-invalid', severity: 'error', message: 'Tip amount must be a number.' });
    }
    tipAmount = Math.max(0, parsed.value ?? 0);
  }

  /* ---- tax ---- */
  let taxAmount = 0;
  if (state.taxMode === 'percent') {
    const parsed = parsePercent(state.taxPercent);
    if (parsed.error) {
      issues.push({ code: 'tax-invalid', severity: 'error', message: 'Tax percentage must be a number.' });
    }
    taxAmount = mulDivRound(subtotal, Math.max(0, parsed.value ?? 0), 10000);
  } else {
    const parsed = parseMoney(state.taxAmount, decimals);
    if (parsed.error) {
      issues.push({ code: 'tax-invalid', severity: 'error', message: 'Tax amount must be a number.' });
    }
    taxAmount = Math.max(0, parsed.value ?? 0);
  }

  const grandTotal = subtotal + tipAmount + taxAmount;

  /* ---- how the bill itself is divided ---- */
  let baseShares: number[] = [];

  if (n > 0) {
    switch (state.splitMode) {
      case 'equal': {
        baseShares = splitEvenly(subtotal, n);
        break;
      }

      case 'percent': {
        const parsed = people.map((p) => parsePercent(p.percent));
        let bad = false;
        parsed.forEach((r, i) => {
          if (r.error) {
            bad = true;
            issues.push({
              code: 'percent-invalid',
              severity: 'error',
              personId: people[i].id,
              message: 'Enter a percentage.',
            });
          }
        });
        const weights = parsed.map((r) => Math.max(0, r.value ?? 0));
        const sum = weights.reduce((a, b) => a + b, 0);
        if (!bad && sum !== 10000) {
          bad = true;
          issues.push({
            code: 'percent-sum',
            severity: 'error',
            message: `Percentages add up to ${formatBasisPoints(sum)}%, they must add up to 100%.`,
          });
        }
        baseShares = bad ? splitEvenly(subtotal, n) : allocateProportionally(subtotal, weights);
        break;
      }

      case 'amount': {
        const parsed = people.map((p) => parseMoney(p.amount, decimals));
        let bad = false;
        parsed.forEach((r, i) => {
          if (r.error) {
            bad = true;
            issues.push({
              code: 'amount-invalid',
              severity: 'error',
              personId: people[i].id,
              message: 'Enter an amount.',
            });
          }
        });
        const values = parsed.map((r) => Math.max(0, r.value ?? 0));
        const sum = values.reduce((a, b) => a + b, 0);
        if (!bad && sum !== subtotal) {
          bad = true;
          issues.push({
            code: 'amount-sum',
            severity: 'error',
            message: `Amounts add up to ${formatMoney(sum, currency)} but the bill is ${formatMoney(subtotal, currency)}.`,
          });
        }
        baseShares = bad ? splitEvenly(subtotal, n) : values;
        break;
      }

      case 'item': {
        const shares = new Array<number>(n).fill(0);
        const indexOf = new Map(people.map((p, i) => [p.id, i] as const));
        state.items.forEach((item, idx) => {
          const amount = itemAmounts[idx] ?? 0;
          const assigned = item.personIds
            .map((id) => indexOf.get(id))
            .filter((i): i is number => i !== undefined);
          const targets = assigned.length ? assigned : people.map((_, i) => i);
          const parts = splitEvenly(amount, targets.length);
          targets.forEach((personIndex, k) => {
            shares[personIndex] += parts[k];
          });
        });
        baseShares = shares;
        break;
      }
    }
  }

  /* ---- tip + tax ride along proportionally to each person's share ---- */
  const tipShares = allocateProportionally(tipAmount, baseShares);
  const taxShares = allocateProportionally(taxAmount, baseShares);

  const personShares: PersonShare[] = people.map((p, i) => {
    const bill = baseShares[i] ?? 0;
    const tip = tipShares[i] ?? 0;
    const tax = taxShares[i] ?? 0;
    return {
      id: p.id,
      name: p.name.trim() || `Person ${i + 1}`,
      subtotal: bill,
      tip,
      tax,
      amount: bill + tip + tax,
    };
  });

  return {
    currency: currency.code,
    splitMode: state.splitMode,
    people: personShares,
    totals: { subtotal, tip: tipAmount, tax: taxAmount, grandTotal },
    isValid: issues.every((i) => i.severity !== 'error'),
    issues,
  };
}