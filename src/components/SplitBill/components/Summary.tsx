// split-bill/components/Summary.tsx
import { memo, useId } from 'react';
import { formatMoney, type CurrencyConfig } from '../helpers';
import type { SplitBillResult } from '../schema';

export interface SummaryProps {
  result: SplitBillResult;
  currency: CurrencyConfig;
}

function SummaryImpl({ result, currency }: SummaryProps) {
  const headingId = useId();
  const { people, totals } = result;
  const showTip = totals.tip > 0;
  const showTax = totals.tax > 0;
  const showBreakdown = showTip || showTax;

  return (
    <section className="sb-summary" aria-labelledby={headingId}>
      <h2 className="sb-summary__heading" id={headingId}>
        Summary
      </h2>

      {people.length === 0 ? (
        <p className="sb-empty">Add people to see who owes what.</p>
      ) : (
        <table className="sb-summary__table">
          <caption className="sb-sr-only">Amount owed per person</caption>
          <thead>
            <tr>
              <th scope="col">Person</th>
              {showBreakdown && <th scope="col">Bill</th>}
              {showTip && <th scope="col">Tip</th>}
              {showTax && <th scope="col">Tax</th>}
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.id}>
                <th scope="row">{person.name}</th>
                {showBreakdown && <td>{formatMoney(person.subtotal, currency)}</td>}
                {showTip && <td>{formatMoney(person.tip, currency)}</td>}
                {showTax && <td>{formatMoney(person.tax, currency)}</td>}
                <td className="sb-summary__amount">{formatMoney(person.amount, currency)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Total</th>
              {showBreakdown && <td>{formatMoney(totals.subtotal, currency)}</td>}
              {showTip && <td>{formatMoney(totals.tip, currency)}</td>}
              {showTax && <td>{formatMoney(totals.tax, currency)}</td>}
              <td className="sb-summary__amount">{formatMoney(totals.grandTotal, currency)}</td>
            </tr>
          </tfoot>
        </table>
      )}
    </section>
  );
}

export const Summary = memo(SummaryImpl);