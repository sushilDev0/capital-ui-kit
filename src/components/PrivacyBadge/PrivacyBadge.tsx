import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";
import { cx } from "../../lib/cx";
import "./privacy-badge.css";

type PrivacyBadgeProps = {
  value: string;
  label?: string;
  revealable?: boolean;
  visibleEnd?: number;
  className?: string;
};

const group = (s: string) => s.replace(/(.{4})/g, "$1 ").trim();

export function PrivacyBadge({
  value,
  label,
  revealable = false,
  visibleEnd = 4,
  className,
}: PrivacyBadgeProps) {
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(false);

  const masked = group(
    value.slice(0, -visibleEnd).replace(/./g, "•") + value.slice(-visibleEnd),
  );
  const text = shown ? group(value) : masked;

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
    >
      {label && <span className="ui-privacy-badge__label">{label}</span>}
      <div className="ui-privacy-badge__row">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={shown ? "shown" : "masked"}
            className="ui-privacy-badge__value"
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
            aria-label={shown ? "Hide value" : "Reveal value"}
            aria-pressed={shown}
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