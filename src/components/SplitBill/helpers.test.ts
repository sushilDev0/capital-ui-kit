// split-bill/helpers.test.ts
import { describe, expect, it } from 'vitest';
import {
  allocateProportionally,
  calculate,
  formatBasisPoints,
  parseMoney,
  parsePercent,
  resolveCurrency,
  splitEvenly,
  toMajorString,
} from './helpers';
import { createInitialState } from './reducer';

const USD = resolveCurrency('USD');
const JPY = resolveCurrency('JPY');

describe('parseMoney', () => {
  it('parses plain and decimal values into minor units', () => {
    expect(parseMoney('12.34', 2).value).toBe(1234);
    expect(parseMoney('12', 2).value).toBe(1200);
    expect(parseMoney('0.5', 2).value).toBe(50);
    expect(parseMoney('1,234.00', 2).value).toBe(123400);
  });

  it('returns null for an empty field', () => {
    expect(parseMoney('', 2)).toEqual({ value: null });
    expect(parseMoney('   ', 2)).toEqual({ value: null });
  });

  it('rejects junk and negatives', () => {
    expect(parseMoney('abc', 2).error).toBeTruthy();
    expect(parseMoney('-5', 2).error).toBeTruthy();
    expect(parseMoney('.', 2).error).toBeTruthy();
  });

  it('rounds half-up beyond the currency precision', () => {
    expect(parseMoney('1.005', 2).value).toBe(101);
    expect(parseMoney('1.004', 2).value).toBe(100);
    expect(parseMoney('12.5', 0).value).toBe(13);
  });

  it('guards against overflow', () => {
    expect(parseMoney('99999999999999999999', 2).error).toBeTruthy();
  });
});

describe('percent helpers', () => {
  it('stores percentages in basis points', () => {
    expect(parsePercent('33.33').value).toBe(3333);
    expect(parsePercent('100').value).toBe(10000);
  });
  it('formats basis points back', () => {
    expect(formatBasisPoints(3333)).toBe('33.33');
    expect(formatBasisPoints(10000)).toBe('100');
  });
});

describe('splitEvenly', () => {
  it('sums exactly to the total', () => {
    expect(splitEvenly(1000, 3)).toEqual([334, 333, 333]);
    expect(splitEvenly(1000, 3).reduce((a, b) => a + b, 0)).toBe(1000);
  });
  it('gives the remainder to the first people, deterministically', () => {
    expect(splitEvenly(10, 4)).toEqual([3, 3, 2, 2]);
  });
  it('handles zero people', () => {
    expect(splitEvenly(100, 0)).toEqual([]);
  });
});

describe('allocateProportionally', () => {
  it('distributes by weight and sums exactly', () => {
    const out = allocateProportionally(1000, [1, 1, 1]);
    expect(out.reduce((a, b) => a + b, 0)).toBe(1000);
    expect(out).toEqual([334, 333, 333]);
  });
  it('gives zero weight to zero shares', () => {
    const out = allocateProportionally(999, [0, 5000, 5000]);
    expect(out[0]).toBe(0);
    expect(out.reduce((a, b) => a + b, 0)).toBe(999);
  });
  it('falls back to an even split when all weights are zero', () => {
    expect(allocateProportionally(10, [0, 0])).toEqual([5, 5]);
  });
  it('is exact for awkward ratios', () => {
    const out = allocateProportionally(12345, [7, 11, 13]);
    expect(out.reduce((a, b) => a + b, 0)).toBe(12345);
  });
});

describe('toMajorString', () => {
  it('round-trips minor units', () => {
    expect(toMajorString(1250, 2)).toBe('12.50');
    expect(toMajorString(1250, 0)).toBe('1250');
  });
});

describe('calculate', () => {
  const base = (over: Partial<ReturnType<typeof createInitialState>> = {}) => ({
    ...createInitialState({ defaultPeople: ['Ana', 'Ben', 'Cara'] }),
    total: '100.00',
    ...over,
  });

  it('splits equally and every share adds up to the grand total', () => {
    const result = calculate(base(), USD);
    expect(result.totals.subtotal).toBe(10000);
    expect(result.people.map((p) => p.amount)).toEqual([3334, 3333, 3333]);
    expect(result.people.reduce((a, p) => a + p.amount, 0)).toBe(result.totals.grandTotal);
    expect(result.isValid).toBe(true);
  });

  it('adds tip and tax to the grand total and keeps the sum exact', () => {
    const result = calculate(base({ tipPercent: '18', taxPercent: '8' }), USD);
    expect(result.totals.tip).toBe(1800);
    expect(result.totals.tax).toBe(800);
    expect(result.totals.grandTotal).toBe(12600);
    expect(result.people.reduce((a, p) => a + p.amount, 0)).toBe(12600);
  });

  it('supports zero-decimal currencies', () => {
    const state = { ...createInitialState({ defaultPeople: ['Ana', 'Ben'] }), total: '1001' };
    const result = calculate(state, JPY);
    expect(result.totals.subtotal).toBe(1001);
    expect(result.people.map((p) => p.amount)).toEqual([501, 500]);
  });

  it('reports an error when percentages do not sum to 100', () => {
    const state = {
      ...base({ splitMode: 'percent' as const }),
    };
    state.people = state.people.map((p) => ({ ...p, percent: '30' }));
    const result = calculate(state, USD);
    expect(result.isValid).toBe(false);
    expect(result.issues.some((i) => i.code === 'percent-sum')).toBe(true);
  });

  it('accepts percentages that sum to exactly 100', () => {
    const state = { ...base({ splitMode: 'percent' as const }) };
    state.people = state.people.map((p, i) => ({ ...p, percent: ['33.33', '33.33', '33.34'][i] }));
    const result = calculate(state, USD);
    expect(result.isValid).toBe(true);
    expect(result.people.reduce((a, p) => a + p.amount, 0)).toBe(10000);
  });

  it('reports an error when custom amounts do not match the bill', () => {
    const state = { ...base({ splitMode: 'amount' as const }) };
    state.people = state.people.map((p, i) => ({ ...p, amount: ['10', '10', '10'][i] }));
    const result = calculate(state, USD);
    expect(result.issues.some((i) => i.code === 'amount-sum')).toBe(true);
  });

  it('handles itemized splits, including shared and unassigned items', () => {
    const state = createInitialState({ defaultPeople: ['Ana', 'Ben'] });
    state.splitMode = 'item';
    state.items = [
      { id: 'i1', name: 'Pizza', amount: '20.00', personIds: ['p1', 'p2'] },
      { id: 'i2', name: 'Steak', amount: '30.00', personIds: ['p1'] },
      { id: 'i3', name: 'Water', amount: '2.00', personIds: [] },
    ];
    const result = calculate(state, USD);
    expect(result.totals.subtotal).toBe(5200);
    expect(result.people[0].amount).toBe(1000 + 3000 + 100);
    expect(result.people[1].amount).toBe(1000 + 100);
    expect(result.issues.some((i) => i.code === 'item-unassigned')).toBe(true);
  });

  it('flags zero people and empty bills', () => {
    const result = calculate(createInitialState({ defaultPeople: [] }), USD);
    expect(result.isValid).toBe(false);
    expect(result.issues.map((i) => i.code)).toEqual(
      expect.arrayContaining(['no-people', 'empty-bill']),
    );
  });

  it('never produces fractional minor units', () => {
    const state = { ...createInitialState({ defaultPeople: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] }), total: '0.07' };
    const result = calculate(state, USD);
    expect(result.people.every((p) => Number.isInteger(p.amount))).toBe(true);
    expect(result.people.reduce((a, p) => a + p.amount, 0)).toBe(7);
  });
});