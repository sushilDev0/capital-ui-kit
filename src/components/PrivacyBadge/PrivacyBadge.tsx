import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EyeOff, Eye, Lock } from "lucide-react";
import { cn } from "../../lib/cn";
import type { PrivacyBadgeProps } from "./schema";
import { groupDigits, maskValue } from "./mask";

const themes = {
  dark: {
    card: "border-slate-800 bg-slate-900/80",
    label: "text-slate-400",
    masked: "text-slate-600",
    revealed: "text-slate-50",
    button: "text-slate-500 hover:bg-slate-800 hover:text-emerald-400",
  },
  light: {
    card: "border-slate-200 bg-white/90",
    label: "text-slate-500",
    masked: "text-slate-400",
    revealed: "text-slate-900",
    button: "text-slate-500 hover:bg-slate-100 hover:text-emerald-600",
  },
};

export function PrivacyBadge({
  value,
  label,
  maskPattern = "last4",
  maskChar = "•",
  revealable = false,
  theme = "dark",
  classNames,
}: PrivacyBadgeProps) {
  const [isMasked, setIsMasked] = useState(true);
const [prevValue, setPrevValue] = useState(value);

if (value !== prevValue) {
  setPrevValue(value);
  setIsMasked(true);
}
  const t = themes[theme];
  const formatted = groupDigits(value);
  const masked = maskValue(formatted, maskPattern, maskChar);
  const showMasked = isMasked || !revealable;
  const name = label ?? "number";
  const toggleLabel = showMasked ? `Reveal ${name}` : `Hide ${name}`;
  const sizeClass = formatted.length > 19 ? "text-lg" : "text-2xl";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "inline-flex w-full max-w-sm flex-col gap-1.5 rounded-2xl border p-4 shadow-lg backdrop-blur-sm",
        t.card,
        classNames?.root,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className={cn("flex items-center gap-1.5", t.label, classNames?.label)}>
          <Lock size={14} className="text-emerald-500" />
          {label && (
            <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
          )}
        </div>

        {revealable && (
          <button
            type="button"
            onClick={() => setIsMasked((prev) => !prev)}
            aria-label={toggleLabel}
            aria-pressed={!showMasked}
            title={toggleLabel}
            className={cn(
              "rounded-full p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50",
              t.button,
            )}
          >
            {showMasked ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        )}
      </div>

      <div className="relative flex h-9 w-full items-center overflow-hidden">
        <span className="sr-only">{showMasked ? `${name} hidden` : formatted}</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={showMasked ? "masked" : "revealed"}
            aria-hidden="true"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={cn(
              "absolute whitespace-nowrap font-mono tabular-nums",
              sizeClass,
              showMasked
                ? cn("select-none font-black tracking-widest", t.masked)
                : cn("font-medium tracking-tight", t.revealed),
              classNames?.value,
            )}
          >
            {showMasked ? masked : formatted}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
