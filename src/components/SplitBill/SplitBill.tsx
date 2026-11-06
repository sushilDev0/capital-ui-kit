// split-bill/SplitBill.tsx
import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import './SplitBill.css';

import { PersonRow } from './components/PersonRow';
import { Summary } from './components/Summary';
import { TipSelector } from './components/TipSelector';
import {
  calculate,
  resolveCurrency,
  toMajorString,
} from './helpers';
import { createInitialState, splitBillReducer, type SplitBillAction } from './reducer';
import type { SplitBillProps, SplitBillResult, SplitBillState, SplitMode } from './schema';
import { ItemsEditor } from './components/ItemsEditor';

const MODE_LABELS: Record<SplitMode, string> = {
  equal: 'Equally',
  amount: 'By amount',
  percent: 'By %',
  item: 'By item',
};

const TIP_PRESETS = [10, 15, 18, 20];
const DEFAULT_MODES: SplitMode[] = ['equal', 'amount', 'percent', 'item'];

export function SplitBill(props: SplitBillProps) {
  const {
    currency = 'USD',
    defaultTip = 0,
    defaultPeople,
    splitModes = DEFAULT_MODES,
    onChange,
    className,
    theme,
    value,
    defaultValue,
    onStateChange,
    initialValue,
    onSubmit,
    isLoading = false,
    error = null,
    disabled = false,
    idPrefix = 'sb',
    maxPeople = 50,
  } = props;

  const currencyConfig = useMemo(() => resolveCurrency(currency), [currency]);

  /* ---- initial state is computed once on mount and reused by "Reset" ---- */
  const [initialState] = useState<SplitBillState>(() =>
    createInitialState({
      defaultTip,
      defaultPeople,
      initialValue: initialValue ?? defaultValue,
    }),
  );

  /* ---- controlled / uncontrolled ---- */
  const [internalState, internalDispatch] = useReducer(splitBillReducer, initialState);
  const isControlled = value !== undefined;
  const state = isControlled ? value : internalState;

  const dispatch = useCallback(
    (action: SplitBillAction) => {
      if (isControlled) {
        onStateChange?.(splitBillReducer(value as SplitBillState, action));
      } else {
        internalDispatch(action);
      }
    },
    [isControlled, value, onStateChange],
  );

  /* ---- derive; never store shares ---- */
  const result = useMemo<SplitBillResult>(
    () => calculate(state, currencyConfig),
    [state, currencyConfig],
  );

  /* ---- notify the parent on mount and on every change ---- */
  const lastEmitted = useRef<SplitBillResult | null>(null);

  useEffect(() => {
    if (lastEmitted.current === result) return;
    lastEmitted.current = result;
    onChange?.(result);
  }, [result, onChange]);

  /* ---- submit ---- */
  const [submitting, setSubmitting] = useState(false);
  const isBusy = isLoading || submitting;
  const isDisabled = disabled || isBusy;

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!onSubmit || submitting) return;
      try {
        setSubmitting(true);
        await onSubmit(result);
      } finally {
        setSubmitting(false);
      }
    },
    [onSubmit, result, submitting],
  );

  /* ---- issues grouped for rendering ---- */
  const issuesByOwner = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const issue of result.issues) {
      const key = issue.personId ?? issue.itemId;
      if (!key) continue;
      const list = map.get(key) ?? [];
      list.push(issue.message);
      map.set(key, list);
    }
    return map;
  }, [result]);

  const globalIssues = result.issues.filter((i) => !i.personId && !i.itemId);
  const globalErrors = globalIssues.filter((i) => i.severity === 'error');
  const globalWarnings = globalIssues.filter((i) => i.severity === 'warning');

  const issueFor = useCallback(
    (key: string): string | null => issuesByOwner.get(key)?.[0] ?? null,
    [issuesByOwner],
  );

  /* ---- stable row callbacks ---- */
  const handleRename = useCallback(
    (id: string, name: string) => dispatch({ type: 'renamePerson', id, name }),
    [dispatch],
  );
  const handleAmountChange = useCallback(
    (id: string, v: string) => dispatch({ type: 'setPersonAmount', id, value: v }),
    [dispatch],
  );
  const handlePercentChange = useCallback(
    (id: string, v: string) => dispatch({ type: 'setPersonPercent', id, value: v }),
    [dispatch],
  );
  const handleRemove = useCallback(
    (id: string) => dispatch({ type: 'removePerson', id }),
    [dispatch],
  );

  const shareById = useMemo(
    () => new Map(result.people.map((p) => [p.id, p.amount] as const)),
    [result],
  );

  const modes = splitModes.includes(state.splitMode)
    ? splitModes
    : [state.splitMode, ...splitModes];

  const isItemMode = state.splitMode === 'item';
  const totalValue = isItemMode
    ? toMajorString(result.totals.subtotal, currencyConfig.decimals)
    : state.total;

  return (
    <section
      className={['split-bill', className].filter(Boolean).join(' ')}
      style={theme as React.CSSProperties}
      aria-busy={isBusy || undefined}
    >
      {error && (
        <div className="sb-alert sb-alert--error" role="alert">
          {error}
        </div>
      )}

      <form className="sb-form" onSubmit={handleSubmit} noValidate>
        {/* ---------- bill amount ---------- */}
        <div className="sb-field">
          <label className="sb-label" htmlFor={`${idPrefix}-total`}>
            Bill amount
          </label>
          <div className="sb-input-wrap">
            <span className="sb-prefix" aria-hidden="true">
              {currencyConfig.symbol}
            </span>
            <input
              id={`${idPrefix}-total`}
              className="sb-input sb-input--money"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="0.00"
              value={totalValue}
              disabled={isDisabled || isItemMode}
              aria-describedby={isItemMode ? `${idPrefix}-total-hint` : undefined}
              onChange={(e) => dispatch({ type: 'setTotal', value: e.target.value })}
            />
          </div>
          {isItemMode && (
            <p className="sb-hint" id={`${idPrefix}-total-hint`}>
              Calculated from the items below.
            </p>
          )}
        </div>

        {/* ---------- split mode ---------- */}
        {modes.length > 1 && (
          <fieldset className="sb-fieldset">
            <legend className="sb-legend">Split</legend>
            <div className="sb-segmented">
              {modes.map((mode) => (
                <label
                  key={mode}
                  className={`sb-segmented__item${state.splitMode === mode ? ' is-active' : ''}`}
                >
                  <input
                    type="radio"
                    className="sb-sr-only"
                    name={`${idPrefix}-mode`}
                    value={mode}
                    checked={state.splitMode === mode}
                    disabled={isDisabled}
                    onChange={() => dispatch({ type: 'setSplitMode', mode })}
                  />
                  <span>{MODE_LABELS[mode]}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {/* ---------- people ---------- */}
        <fieldset className="sb-fieldset">
          <legend className="sb-legend">People</legend>

          {state.people.length === 0 ? (
            <p className="sb-empty">No one here yet. Add the first person to get started.</p>
          ) : (
            <ul className="sb-people">
              {state.people.map((person, index) => (
                <PersonRow
                  key={person.id}
                  person={person}
                  index={index}
                  splitMode={state.splitMode}
                  currency={currencyConfig}
                  shareAmount={shareById.get(person.id) ?? 0}
                  issue={issueFor(person.id)}
                  canRemove={state.people.length > 1}
                  disabled={isDisabled}
                  idPrefix={idPrefix}
                  onRename={handleRename}
                  onAmountChange={handleAmountChange}
                  onPercentChange={handlePercentChange}
                  onRemove={handleRemove}
                />
              ))}
            </ul>
          )}

          <button
            type="button"
            className="sb-btn sb-btn--ghost"
            disabled={isDisabled || state.people.length >= maxPeople}
            onClick={() => dispatch({ type: 'addPerson' })}
          >
            + Add person
          </button>
        </fieldset>

        {/* ---------- itemized editor (step 8) ---------- */}
        {isItemMode && (
          <ItemsEditor
            items={state.items}
            people={state.people}
            currency={currencyConfig}
            idPrefix={idPrefix}
            disabled={isDisabled}
            issueFor={issueFor}
            onAdd={() => dispatch({ type: 'addItem' })}
            onRemove={(id) => dispatch({ type: 'removeItem', id })}
            onUpdate={(id, patch) => dispatch({ type: 'updateItem', id, patch })}
            onTogglePerson={(itemId, personId) =>
              dispatch({ type: 'toggleItemPerson', itemId, personId })
            }
          />
        )}

        {/* ---------- tip ---------- */}
        <TipSelector
          mode={state.tipMode}
          percent={state.tipPercent}
          amount={state.tipAmount}
          currency={currencyConfig}
          presets={TIP_PRESETS}
          disabled={isDisabled}
          idPrefix={idPrefix}
          onModeChange={(mode) => dispatch({ type: 'setTipMode', mode })}
          onPercentChange={(v) => dispatch({ type: 'setTipPercent', value: v })}
          onAmountChange={(v) => dispatch({ type: 'setTipAmount', value: v })}
        />

        {/* ---------- tax ---------- */}
        <fieldset className="sb-fieldset">
          <legend className="sb-legend">Tax</legend>
          <div className="sb-inline">
            <label className="sb-sr-only" htmlFor={`${idPrefix}-tax`}>
              Tax {state.taxMode === 'percent' ? 'percentage' : 'amount'}
            </label>
            <div className="sb-input-wrap">
              <input
                id={`${idPrefix}-tax`}
                className="sb-input sb-input--money"
                type="text"
                inputMode="decimal"
                placeholder={state.taxMode === 'percent' ? '0' : '0.00'}
                value={state.taxMode === 'percent' ? state.taxPercent : state.taxAmount}
                disabled={isDisabled}
                onChange={(e) =>
                  state.taxMode === 'percent'
                    ? dispatch({ type: 'setTaxPercent', value: e.target.value })
                    : dispatch({ type: 'setTaxAmount', value: e.target.value })
                }
              />
              <span className="sb-suffix" aria-hidden="true">
                {state.taxMode === 'percent' ? '%' : currencyConfig.symbol}
              </span>
            </div>
            <div className="sb-toggle" role="group" aria-label="Tax input type">
              <button
                type="button"
                className={`sb-toggle__btn${state.taxMode === 'percent' ? ' is-active' : ''}`}
                aria-pressed={state.taxMode === 'percent'}
                disabled={isDisabled}
                onClick={() => dispatch({ type: 'setTaxMode', mode: 'percent' })}
              >
                %
              </button>
              <button
                type="button"
                className={`sb-toggle__btn${state.taxMode === 'amount' ? ' is-active' : ''}`}
                aria-pressed={state.taxMode === 'amount'}
                disabled={isDisabled}
                onClick={() => dispatch({ type: 'setTaxMode', mode: 'amount' })}
              >
                {currencyConfig.symbol}
              </button>
            </div>
          </div>
        </fieldset>

        {/* ---------- messages ---------- */}
        <div className="sb-messages" aria-live="polite">
          {globalErrors.map((issue) => (
            <p key={issue.code + issue.message} className="sb-error" role="alert">
              {issue.message}
            </p>
          ))}
          {globalWarnings.map((issue) => (
            <p key={issue.code + issue.message} className="sb-warning">
              {issue.message}
            </p>
          ))}
        </div>

        {/* ---------- summary ---------- */}
        <Summary result={result} currency={currencyConfig} />

        {/* ---------- actions ---------- */}
        <div className="sb-actions">
          <button
            type="button"
            className="sb-btn sb-btn--ghost"
            disabled={isDisabled}
            onClick={() => dispatch({ type: 'reset', state: initialState })}
          >
            Reset
          </button>
          {onSubmit && (
            <button type="submit" className="sb-btn sb-btn--primary" disabled={isBusy}>
              {submitting ? 'Saving…' : 'Save bill'}
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default SplitBill;