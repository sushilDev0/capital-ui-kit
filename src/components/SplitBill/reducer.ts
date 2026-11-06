// split-bill/reducer.ts
import { formatBasisPoints, splitEvenly } from './helpers';
import type { AmountMode, BillItem, Person, SplitBillState, SplitMode } from './schema';

export interface CreateInitialStateOptions {
  defaultTip?: number;
  defaultPeople?: Array<string | { name: string }>;
  initialValue?: Partial<SplitBillState>;
}

const DEFAULT_PEOPLE = ['', ''];

function makePerson(id: string, name = ''): Person {
  return { id, name, amount: '', percent: '' };
}

export function createInitialState(options: CreateInitialStateOptions = {}): SplitBillState {
  const { defaultTip = 0, defaultPeople = DEFAULT_PEOPLE, initialValue } = options;

  const state: SplitBillState = {
    total: '',
    splitMode: 'equal',
    tipMode: 'percent',
    tipPercent: defaultTip ? String(defaultTip) : '',
    tipAmount: '',
    taxMode: 'percent',
    taxPercent: '',
    taxAmount: '',
    people: [],
    items: [],
    seq: 0,
  };

  let seq = 0;
  state.people = defaultPeople.map((entry) => {
    seq += 1;
    return makePerson(`p${seq}`, typeof entry === 'string' ? entry : entry.name);
  });
  state.seq = seq;

  return initialValue ? { ...state, ...initialValue, seq: initialValue.seq ?? state.seq } : state;
}

/* ------------------------------------------------------------------ */

export type SplitBillAction =
  | { type: 'setTotal'; value: string }
  | { type: 'setSplitMode'; mode: SplitMode }
  | { type: 'addPerson'; name?: string }
  | { type: 'removePerson'; id: string }
  | { type: 'renamePerson'; id: string; name: string }
  | { type: 'setPersonAmount'; id: string; value: string }
  | { type: 'setPersonPercent'; id: string; value: string }
  | { type: 'setTipMode'; mode: AmountMode }
  | { type: 'setTipPercent'; value: string }
  | { type: 'setTipAmount'; value: string }
  | { type: 'setTaxMode'; mode: AmountMode }
  | { type: 'setTaxPercent'; value: string }
  | { type: 'setTaxAmount'; value: string }
  | { type: 'addItem'; name?: string; amount?: string }
  | { type: 'updateItem'; id: string; patch: Partial<Pick<BillItem, 'name' | 'amount'>> }
  | { type: 'removeItem'; id: string }
  | { type: 'toggleItemPerson'; itemId: string; personId: string }
  | { type: 'reset'; state: SplitBillState }
  | { type: 'replace'; state: SplitBillState };

function mapPerson(state: SplitBillState, id: string, patch: Partial<Person>): SplitBillState {
  return {
    ...state,
    people: state.people.map((p) => (p.id === id ? { ...p, ...patch } : p)),
  };
}

export function splitBillReducer(state: SplitBillState, action: SplitBillAction): SplitBillState {
  switch (action.type) {
    case 'setTotal':
      return { ...state, total: action.value };

    case 'setSplitMode': {
      if (action.mode === state.splitMode) return state;
      let people = state.people;
      // Convenience: seed percentages so the sum is already 100.
      if (
        action.mode === 'percent' &&
        people.length > 0 &&
        people.every((p) => p.percent.trim() === '')
      ) {
        const parts = splitEvenly(10000, people.length);
        people = people.map((p, i) => ({ ...p, percent: formatBasisPoints(parts[i]) }));
      }
      return { ...state, splitMode: action.mode, people };
    }

    case 'addPerson': {
      const seq = state.seq + 1;
      return {
        ...state,
        seq,
        people: [...state.people, makePerson(`p${seq}`, action.name ?? '')],
      };
    }

    case 'removePerson':
      return {
        ...state,
        people: state.people.filter((p) => p.id !== action.id),
        // Keep items consistent: a removed person is unassigned from every item.
        items: state.items.map((item) =>
          item.personIds.includes(action.id)
            ? { ...item, personIds: item.personIds.filter((id) => id !== action.id) }
            : item,
        ),
      };

    case 'renamePerson':
      return mapPerson(state, action.id, { name: action.name });

    case 'setPersonAmount':
      return mapPerson(state, action.id, { amount: action.value });

    case 'setPersonPercent':
      return mapPerson(state, action.id, { percent: action.value });

    case 'setTipMode':
      return { ...state, tipMode: action.mode };
    case 'setTipPercent':
      return { ...state, tipMode: 'percent', tipPercent: action.value };
    case 'setTipAmount':
      return { ...state, tipMode: 'amount', tipAmount: action.value };

    case 'setTaxMode':
      return { ...state, taxMode: action.mode };
    case 'setTaxPercent':
      return { ...state, taxMode: 'percent', taxPercent: action.value };
    case 'setTaxAmount':
      return { ...state, taxMode: 'amount', taxAmount: action.value };

    case 'addItem': {
      const seq = state.seq + 1;
      return {
        ...state,
        seq,
        items: [
          ...state.items,
          {
            id: `i${seq}`,
            name: action.name ?? '',
            amount: action.amount ?? '',
            personIds: state.people.map((p) => p.id),
          },
        ],
      };
    }

    case 'updateItem':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, ...action.patch } : item,
        ),
      };

    case 'removeItem':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };

    case 'toggleItemPerson':
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id !== action.itemId) return item;
          const has = item.personIds.includes(action.personId);
          return {
            ...item,
            personIds: has
              ? item.personIds.filter((id) => id !== action.personId)
              : [...item.personIds, action.personId],
          };
        }),
      };

    case 'reset':
    case 'replace':
      return action.state;

    default:
      return state;
  }
}