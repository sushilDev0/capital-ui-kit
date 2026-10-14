import { useEffect, useMemo } from "react";
import { motion, useSpring, useTransform, useReducedMotion } from "motion/react";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { CurrencyCounterProps } from "./schema";

const themes = {
  dark: {
    card: "border-slate-800 bg-slate-900/80",
    label: "text-slate-400",
    value: "text-slate-50",
  },
  light: {
    card: "border-slate-200 bg-white/90",
    label: "text-slate-500",
    value: "text-slate-900",
  },
};

export function CurrencyCounter({
  value,
  currency = "INR",
  locale = "en-IN",
  label,
  trendPercentage,
  theme = "dark",
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

  const t = themes[theme];
  const isUp = safeTrend !== undefined && safeTrend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`inline-flex w-full max-w-sm flex-col gap-1 rounded-2xl border p-5 shadow-lg backdrop-blur-sm ${t.card}`}
    >
      {label && (
        <span className={`text-xs font-medium uppercase tracking-wide ${t.label}`}>
          {label}
        </span>
      )}

      <div className="mt-1 flex items-baseline justify-between gap-2">
        <span className="sr-only">{formatter.format(safeValue)}</span>
        <motion.span
          aria-hidden="true"
          className={`font-mono text-3xl font-bold tabular-nums tracking-tight ${t.value}`}
        >
          {displayValue}
        </motion.span>

        {safeTrend !== undefined && (
          <div
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${
              isUp
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-rose-500/20 bg-rose-500/10 text-rose-400"
            }`}
          >
            {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>
              {isUp ? "+" : ""}
              {safeTrend.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}