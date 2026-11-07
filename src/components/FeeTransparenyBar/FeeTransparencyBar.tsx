import { useEffect, useMemo, useRef } from "react";
import { cx } from "../../lib/cx"; // Assuming you have a cx helper based on README
import { calculateFees, formatMoney } from "./helpers";
import type { FeeTransparencyBarProps, FeeTransparencyBarResult } from "./schema";
import "./FeeTransparencyBar.css";

export function FeeTransparencyBar({
  amount,
  fees,
  currency = "USD",
  locale = "en-US",
  variant = "detailed",
  theme = "dark",
  className,
  onChange,
}: FeeTransparencyBarProps) {
  
  // 1. Calculate pure math exactly once per state change
  const result = useMemo<FeeTransparencyBarResult>(
    () => calculateFees(amount, fees),
    [amount, fees]
  );

  // 2. Notify parent (using the lastEmitted guard to prevent infinite loops)
  const lastEmitted = useRef<FeeTransparencyBarResult | null>(null);
  useEffect(() => {
    if (lastEmitted.current === result) return;
    lastEmitted.current = result;
    onChange?.(result);
  }, [result, onChange]);

  const format = (val: number) => formatMoney(val, currency, locale);

  return (
    <div
      className={cx("fee-transparency-bar", className)}
      data-variant={variant}
      data-theme={theme}
      aria-live="polite" // Announces updates to screen readers
    >
      <div className="fee-transparency-bar__glow" aria-hidden="true" />
      
      <div className="fee-transparency-bar__inner">
        {/* Header */}
        <div className="fee-transparency-bar__header">
          <h3 className="fee-transparency-bar__title">Fee Breakdown</h3>
          <button 
            type="button" 
            className="fee-transparency-bar__tooltip-trigger" 
            aria-label="More information about fees"
            title="Fees are calculated based on the transfer amount and network conditions."
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </button>
        </div>

        {/* Line Items */}
        <div className="fee-transparency-bar__items">
          <div className="fee-transparency-bar__row">
            <span className="fee-transparency-bar__label">Amount</span>
            <span className="fee-transparency-bar__value">{format(result.subtotal)}</span>
          </div>

          {result.breakdown.map((fee, idx) => (
            <div key={fee.id || idx} className="fee-transparency-bar__row">
              <span className="fee-transparency-bar__label" title={fee.description}>
                {fee.label}
                {fee.type === "percentage" && ` (${fee.value}%)`}
              </span>
              
              {fee.amount === 0 ? (
                <span className="fee-transparency-bar__free-badge">Free</span>
              ) : (
                <span className="fee-transparency-bar__value">{format(fee.amount)}</span>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <hr className="fee-transparency-bar__divider" />

        {/* Total Row */}
        <div className="fee-transparency-bar__total-row">
          <div>
            <div className="fee-transparency-bar__total-label">Total to pay</div>
            <div className="fee-transparency-bar__total-sub">Includes all fees</div>
          </div>
          <div className="fee-transparency-bar__total-value">
            {format(result.total)}
          </div>
        </div>

        {/* Trust Footer */}
        <div className="fee-transparency-bar__footer">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{ color: "var(--fee-accent-success)" }} aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Zero hidden fees. What you see is what you pay.</span>
        </div>
      </div>
    </div>
  );
}