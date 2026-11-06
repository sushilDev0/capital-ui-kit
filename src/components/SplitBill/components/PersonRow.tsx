import  { memo } from 'react';
import { formatMoney, type CurrencyConfig } from '../helpers';
import type { Person, SplitMode } from '../schema';

export interface PersonRowProps {
  person: Person;
  index: number;
  splitMode: SplitMode;
  currency: CurrencyConfig;
  shareAmount: number;
  issue: string | null;
  canRemove: boolean;
  disabled: boolean;
  idPrefix: string;
  onRename: (id: string, name: string) => void;
  onAmountChange: (id: string, value: string) => void;
  onPercentChange: (id: string, value: string) => void;
  onRemove: (id: string) => void;
}

function PersonRowImpl({
  person,
  index,
  splitMode,
  currency,
  shareAmount,
  issue,
  canRemove,
  disabled,
  idPrefix,
  onRename,
  onAmountChange,
  onPercentChange,
  onRemove,
}: PersonRowProps) {
  const label = person.name.trim() || `person ${index + 1}`;
  const nameId = `${idPrefix}-${person.id}-name`;
  const valueId = `${idPrefix}-${person.id}-value`;
  const errorId = `${idPrefix}-${person.id}-error`;
  const showValueInput = splitMode === 'amount' || splitMode === 'percent';

  return (
    <li className="sb-person">
      <div className="sb-person__main">
        <label className="sb-sr-only" htmlFor={nameId}>
          {`Name of person ${index + 1}`}
        </label>
        <input
          id={nameId}
          className="sb-input sb-person__name"
          type="text"
          value={person.name}
          placeholder={`Person ${index + 1}`}
          autoComplete="off"
          disabled={disabled}
          onChange={(e) => onRename(person.id, e.target.value)}
        />

        {showValueInput && (
          <div className="sb-input-wrap sb-person__value">
            <label className="sb-sr-only" htmlFor={valueId}>
              {splitMode === 'percent' ? `Percentage for ${label}` : `Amount for ${label}`}
            </label>
            <input
              id={valueId}
              className="sb-input sb-input--money"
              type="text"
              inputMode="decimal"
              value={splitMode === 'percent' ? person.percent : person.amount}
              placeholder={splitMode === 'percent' ? '0' : '0.00'}
              disabled={disabled}
              aria-invalid={issue ? true : undefined}
              aria-describedby={issue ? errorId : undefined}
              onChange={(e) =>
                splitMode === 'percent'
                  ? onPercentChange(person.id, e.target.value)
                  : onAmountChange(person.id, e.target.value)
              }
            />
            {splitMode === 'percent' && (
              <span className="sb-suffix" aria-hidden="true">%</span>
            )}
          </div>
        )}

        <output className="sb-person__share" aria-label={`${label} owes`}>
          {formatMoney(shareAmount, currency)}
        </output>

        <button
          type="button"
          className="sb-icon-btn"
          onClick={() => onRemove(person.id)}
          disabled={disabled || !canRemove}
          aria-label={`Remove ${label}`}
          title={`Remove ${label}`}
        >
          ×
        </button>
      </div>

      {issue && (
        <p className="sb-error" id={errorId}>{issue}</p>
      )}
    </li>
  );
}

export const PersonRow = memo(PersonRowImpl);