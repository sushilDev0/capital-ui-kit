// split-bill/components/TipSelector.tsx
import { memo } from 'react';
import type { CurrencyConfig } from '../helpers';
import type { AmountMode } from '../schema';

export interface TipSelectorProps {
  mode: AmountMode;
  percent: string;
  amount: string;
  currency: CurrencyConfig;
  presets: number[];
  disabled: boolean;
  idPrefix: string;
  onModeChange: (mode: AmountMode) => void;
  onPercentChange: (value: string) => void;
  onAmountChange: (value: string) => void;
}

function TipSelectorImpl({
  mode,
  percent,
  amount,
  currency,
  presets,
  disabled,
  idPrefix,
  onModeChange,
  onPercentChange,
  onAmountChange,
}: TipSelectorProps) {
  const inputId = `${idPrefix}-tip`;

  return (
    <fieldset className="sb-fieldset">
      <legend className="sb-legend">Tip</legend>

      <div className="sb-chips" role="group" aria-label="Tip presets">
        {presets.map((preset) => {
          const active = mode === 'percent' && percent === String(preset);
          return (
            <button
              key={preset}
              type="button"
              className={`sb-chip${active ? ' is-active' : ''}`}
              aria-pressed={active}
              disabled={disabled}
              onClick={() => {
                onModeChange('percent');
                onPercentChange(String(preset));
              }}
            >
              {preset}%
            </button>
          );
        })}
      </div>

      <div className="sb-inline">
        <label className="sb-sr-only" htmlFor={inputId}>
          Tip {mode === 'percent' ? 'percentage' : 'amount'}
        </label>
        <div className="sb-input-wrap">
          <input
            id={inputId}
            className="sb-input sb-input--money"
            type="text"
            inputMode="decimal"
            value={mode === 'percent' ? percent : amount}
            placeholder={mode === 'percent' ? '0' : '0.00'}
            disabled={disabled}
            onChange={(e) =>
              mode === 'percent' ? onPercentChange(e.target.value) : onAmountChange(e.target.value)
            }
          />
          <span className="sb-suffix" aria-hidden="true">
            {mode === 'percent' ? '%' : currency.symbol}
          </span>
        </div>

        <div className="sb-toggle" role="group" aria-label="Tip input type">
          <button
            type="button"
            className={`sb-toggle__btn${mode === 'percent' ? ' is-active' : ''}`}
            aria-pressed={mode === 'percent'}
            disabled={disabled}
            onClick={() => onModeChange('percent')}
          >
            %
          </button>
          <button
            type="button"
            className={`sb-toggle__btn${mode === 'amount' ? ' is-active' : ''}`}
            aria-pressed={mode === 'amount'}
            disabled={disabled}
            onClick={() => onModeChange('amount')}
          >
            {currency.symbol}
          </button>
        </div>
      </div>
    </fieldset>
  );
}

export const TipSelector = memo(TipSelectorImpl);