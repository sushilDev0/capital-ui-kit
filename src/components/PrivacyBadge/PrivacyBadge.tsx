import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";
import { cx } from "../../lib/cx";
import { compact, describeMasked, groupChars, maskValue } from "./mask";
import type { PrivacyBadgeProps } from "./schema";
import "./privacy-badge.css";

export function PrivacyBadge({
  value,
  label,
  maskPattern = "last4",
  maskChar = "•",
  revealable = false,
  theme = "dark",
  className,
}: PrivacyBadgeProps) {
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(false);

  const raw = compact(value);
  const revealed = groupChars(raw);
  const masked = groupChars(maskValue(raw, maskPattern, maskChar));
  const text = shown ? revealed : masked;

  // The visible text is hidden from assistive tech. This live region replaces it, so a
  // screen reader hears "Hidden, ending in 3 4 5 6" instead of a row of bullets, and
  // hears the change when the person presses the reveal button.
  const announcement = shown ? raw.split("").join(" ") : describeMasked(raw, maskPattern);

  const swap = reduceMotion
    ? { initial: false as const, animate: {}, exit: {}, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, filter: "blur(4px)", y: 4 },
        animate: { opacity: 1, filter: "blur(0px)", y: 0 },
        exit: { opacity: 0, filter: "blur(4px)", y: -4 },
        transition: { duration: 0.18 },
      };

  const iconSwap = reduceMotion
    ? { initial: false as const, animate: {}, exit: {}, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, rotate: -90, scale: 0.6 },
        animate: { opacity: 1, rotate: 0, scale: 1 },
        exit: { opacity: 0, rotate: 90, scale: 0.6 },
        transition: { duration: 0.15 },
      };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cx("ui-privacy-badge", className)}
      data-theme={theme}
    >
      {label && <span className="ui-privacy-badge__label">{label}</span>}
      <div className="ui-privacy-badge__row">
        <span className="ui-sr-only" aria-live="polite">
          {announcement}
        </span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={shown ? "shown" : "masked"}
            className="ui-privacy-badge__value"
            aria-hidden="true"
            {...swap}
          >
            {text}
          </motion.span>
        </AnimatePresence>

        {revealable && (
          <motion.button
            type="button"
            className="ui-privacy-badge__toggle"
            onClick={() => setShown((s) => !s)}
            aria-label={shown ? "Hide number" : "Show number"}
            whileTap={reduceMotion ? undefined : { scale: 0.9 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={shown ? "off" : "on"}
                style={{ display: "inline-flex" }}
                {...iconSwap}
              >
                {shown ? <EyeOff size={16} /> : <Eye size={16} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
