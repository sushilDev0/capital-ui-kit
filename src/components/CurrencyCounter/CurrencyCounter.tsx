import { useEffect, useMemo } from "react";
import { motion, useSpring, useTransform, useReducedMotion } from "motion/react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cx } from "../../lib/cx";
import type { CurrencyCounterProps } from "./schema";
import "./currency-counter.css";

export function CurrencyCounter({
  value,
  currency = "INR",
  locale = "en-IN",
  label,
  trendPercentage,
  trendDirection,
  theme = "dark",
  className,
}: CurrencyCounterProps) {
  const reduceMotion = useReducedMotion();

  const safeValue = Number.isFinite(value) ? value : 0;
  const safeTrend =
    trendPercentage !== undefined && Number.isFinite(trendPercentage)
      ? trendPercentage
      : undefined;

  const formatter = useMemo(() => {
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      });
    } catch {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      });
    }
  }, [locale, currency]);

  const springValue = useSpring(0, { stiffness: 60, damping: 18, mass: 1 });

  useEffect(() => {
    if (reduceMotion) springValue.jump(safeValue);
    else springValue.set(safeValue);
  }, [safeValue, reduceMotion, springValue]);

  const displayValue = useTransform(springValue, (latest) => formatter.format(latest));

  // The arrow and colour follow trendDirection when it is given, otherwise the sign of
  // trendPercentage. The percentage text always shows the number as it was passed in.
  const direction = trendDirection ?? (safeTrend !== undefined && safeTrend < 0 ? "down" : "up");
  const isUp = direction === "up";
  const sign = safeTrend !== undefined && safeTrend >= 0 ? "+" : "";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cx("ui-currency-counter", className)}
      data-theme={theme}
    >
      {label && <span className="ui-currency-counter__label">{label}</span>}

      <div className="ui-currency-counter__row">
        <span className="ui-sr-only">{formatter.format(safeValue)}</span>
        <motion.span aria-hidden="true" className="ui-currency-counter__value">
          {displayValue}
        </motion.span>

        {safeTrend !== undefined && (
          <div
            className="ui-currency-counter__trend"
            data-direction={isUp ? "up" : "down"}
          >
            {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>
              <span className="ui-sr-only">{isUp ? "Trending up " : "Trending down "}</span>
              {sign}
              {safeTrend.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}