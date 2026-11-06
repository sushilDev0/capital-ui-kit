// split-bill/components/ItemsEditor.tsx
import  { memo } from 'react';
import { type CurrencyConfig } from '../helpers';
import type { BillItem, Person } from '../schema';

export interface ItemsEditorProps {
  items: BillItem[];
  people: Person[];
  currency: CurrencyConfig;
  idPrefix: string;
  disabled: boolean;
  issueFor: (key: string) => string | null;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Pick<BillItem, 'name' | 'amount'>>) => void;
  onTogglePerson: (itemId: string, personId: string) => void;
}

function ItemsEditorImpl({
  items,
  people,
  currency,
  idPrefix,
  disabled,
  issueFor,
  onAdd,
  onRemove,
  onUpdate,
  onTogglePerson,
}: ItemsEditorProps) {
  return (
    <fieldset className="sb-fieldset">
      <legend className="sb-legend">Items</legend>

      {items.length === 0 ? (
        <p className="sb-empty">No items yet. Add one to start assigning.</p>
      ) : (
        <ul className="sb-items">
          {items.map((item, index) => {
            const issue = issueFor(item.id);
            const nameId = `${idPrefix}-${item.id}-name`;
            const amountId = `${idPrefix}-${item.id}-amount`;
            const errorId = `${idPrefix}-${item.id}-error`;
            return (
              <li className="sb-item" key={item.id}>
                <div className="sb-person__main">
                  <label className="sb-sr-only" htmlFor={nameId}>
                    {`Item ${index + 1} name`}
                  </label>
                  <input
                    id={nameId}
                    className="sb-input sb-person__name"
                    type="text"
                    placeholder={`Item ${index + 1}`}
                    value={item.name}
                    autoComplete="off"
                    disabled={disabled}
                    onChange={(e) => onUpdate(item.id, { name: e.target.value })}
                  />
                  <div className="sb-input-wrap sb-person__value">
                    <label className="sb-sr-only" htmlFor={amountId}>
                      {`Amount for ${item.name || `item ${index + 1}`}`}
                    </label>
                    <input
                      id={amountId}
                      className="sb-input sb-input--money"
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={item.amount}
                      disabled={disabled}
                      aria-invalid={issue ? true : undefined}
                      aria-describedby={issue ? errorId : undefined}
                      onChange={(e) => onUpdate(item.id, { amount: e.target.value })}
                    />
                    <span className="sb-suffix" aria-hidden="true">
                      {currency.symbol}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="sb-icon-btn"
                    aria-label={`Remove ${item.name || `item ${index + 1}`}`}
                    disabled={disabled}
                    onClick={() => onRemove(item.id)}
                  >
                    ×
                  </button>
                </div>

                <div className="sb-chips" role="group" aria-label={`Who shared ${item.name || `item ${index + 1}`}`}>
                  {people.map((person) => {
                    const active = item.personIds.includes(person.id);
                    return (
                      <button
                        key={person.id}
                        type="button"
                        className={`sb-chip${active ? ' is-active' : ''}`}
                        aria-pressed={active}
                        disabled={disabled}
                        onClick={() => onTogglePerson(item.id, person.id)}
                      >
                        {person.name.trim() || 'Unnamed'}
                      </button>
                    );
                  })}
                </div>

                {issue && (
                  <p className="sb-warning" id={errorId}>
                    {issue}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <button type="button" className="sb-btn sb-btn--ghost" disabled={disabled} onClick={onAdd}>
        + Add item
      </button>
    </fieldset>
  );
}

export const ItemsEditor = memo(ItemsEditorImpl);