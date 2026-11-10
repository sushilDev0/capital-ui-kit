import React, { useMemo, useId } from "react";
import { motion, useReducedMotion } from "motion/react"; // 👈 Added Motion
import { cx } from "../../lib/cx";
import { calculateGoalProgress, calculateTimeLeft, createMoneyFormatter } from "./helpers";
import type { SavingsGoalProps } from "./schema";
import "./SavingsGoalTracker.css";

function SavingsGoalTrackerImpl({
  targetAmount,
  savedAmount,
  currency = "USD",
  locale = "en-US",
  variant = "default",
  title = "Savings Goal",
  targetDate,
  theme = "dark",
  className,
  icon,
  action,
  renderFooter,
  formatValue,
  onContribute,
}: SavingsGoalProps) {
  const componentId = useId();
  const shouldReduceMotion = useReducedMotion(); // 👈 Respects OS preferences

  // 1. Memoize Math
  const progress = useMemo(
    () => calculateGoalProgress(savedAmount, targetAmount),
    [savedAmount, targetAmount]
  );

  const timeLeft = useMemo(
    () => calculateTimeLeft(targetDate, locale),
    [targetDate, locale]
  );

  // 2. Memoize Formatter
  const format = useMemo(() => {
    if (formatValue) return formatValue;
    return createMoneyFormatter(currency, locale);
  }, [formatValue, currency, locale]);

  const savedFormatted = format(savedAmount);
  const targetFormatted = format(targetAmount);
  const remainingFormatted = format(progress.remaining);
  const overfundedFormatted = format(progress.overfunded);

  const rootClass = cx(
    "savings-goal",
    `savings-goal--${variant}`,
    className
  );

  // 3. Accessibility Props
  const progressBarProps = {
    role: "progressbar",
    "aria-valuenow": progress.percentage,
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    "aria-label": `Savings progress for ${title}`,
  } as const;

  // 4. Motion Configs
  const springConfig = shouldReduceMotion 
    ? { duration: 0 } 
    : { type: "spring" as const, stiffness: 90, damping: 20 };

  const initialWidth = shouldReduceMotion ? `${progress.percentage}%` : "0%";

  // 5. Reusable Footer Logic
  const defaultFooter = progress.isComplete ? (
    <p className="sg-footer__text sg-footer__text--success" aria-live="polite">
      🎉 You've exceeded your goal by {overfundedFormatted}!
    </p>
  ) : (
    <p className="sg-footer__text">
      <strong>{remainingFormatted}</strong> left to reach your goal.
    </p>
  );

  /* ---------- Circular Variant ---------- */
  if (variant === "circular") {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress.percentage / 100) * circumference;

    return (
      <div className={rootClass} data-theme={theme} data-id={componentId}>
        <div className="sg-circular">
          <svg className="sg-circular__svg" viewBox="0 0 100 100" aria-hidden="true">
            <circle className="sg-circular__track" cx="50" cy="50" r={radius} />
            {/* 🚀 MOTION CIRCLE */}
            <motion.circle
              className="sg-circular__fill"
              cx="50" cy="50" r={radius}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={springConfig}
              data-complete={progress.isComplete}
            />
          </svg>
          <div className="sg-circular__content" {...progressBarProps}>
            <span className="sg-circular__percentage">{Math.round(progress.percentage)}%</span>
            <span className="sg-circular__label">Saved</span>
          </div>
        </div>
        <div className="sg-circular__info">
          <div className="sg-title-row">
            {icon && <span className="sg-icon">{icon}</span>}
            <h4 className="sg-title">{title}</h4>
          </div>
          <p className="sg-subtitle">{savedFormatted} of {targetFormatted}</p>
          {action && <div className="sg-action-slot">{action}</div>}
        </div>
      </div>
    );
  }

  /* ---------- Compact Variant ---------- */
  if (variant === "compact") {
    return (
      <div className={rootClass} data-theme={theme} data-id={componentId}>
        <div className="sg-compact__header">
          <div className="sg-title-row">
            {icon && <span className="sg-icon">{icon}</span>}
            <h4 className="sg-title">{title}</h4>
          </div>
          <span className="sg-compact__percentage" data-complete={progress.isComplete}>
            {Math.round(progress.percentage)}%
          </span>
        </div>
        
        <div className="sg-progress-bar" {...progressBarProps}>
          {/* 🚀 MOTION DIV */}
          <motion.div 
            className="sg-progress-bar__fill" 
            initial={{ width: initialWidth }}
            animate={{ width: `${progress.percentage}%` }}
            transition={springConfig}
            data-complete={progress.isComplete} 
          />
        </div>
        
        <div className="sg-compact__footer">
          <span>{savedFormatted}</span>
          <span>{targetFormatted}</span>
        </div>
      </div>
    );
  }

  /* ---------- Detailed & Default Variants ---------- */
  return (
    <div className={rootClass} data-theme={theme} data-id={componentId}>
      <div className="sg-header">
        <div>
          <div className="sg-title-row">
            {icon && <span className="sg-icon">{icon}</span>}
            <h3 className="sg-title">{title}</h3>
          </div>
          {timeLeft && !progress.isComplete && (
            <p className="sg-subtitle">Target: {timeLeft}</p>
          )}
        </div>
        <div className="sg-badge" data-complete={progress.isComplete}>
          {progress.isComplete ? "Goal Reached" : `${Math.round(progress.percentage)}%`}
        </div>
      </div>

      <div className="sg-amounts">
        <span className="sg-amounts__saved">{savedFormatted}</span>
        <span className="sg-amounts__target">of {targetFormatted}</span>
      </div>

      <div className="sg-progress-bar" {...progressBarProps}>
        {/* 🚀 MOTION DIV */}
        <motion.div 
          className="sg-progress-bar__fill" 
          initial={{ width: initialWidth }}
          animate={{ width: `${progress.percentage}%` }}
          transition={springConfig}
          data-complete={progress.isComplete}
        />
      </div>

      <div className="sg-footer">
        <div className="sg-footer__content">
          {renderFooter ? renderFooter(progress) : defaultFooter}
        </div>
        
        {action ? (
          <div className="sg-action-slot">{action}</div>
        ) : variant === "detailed" && !progress.isComplete ? (
          <button className="sg-btn" type="button" onClick={onContribute}>
            Contribute
          </button>
        ) : null}
      </div>
    </div>
  );
}

// 6. Wrap in React.memo for performance
export const SavingsGoalTracker = React.memo(SavingsGoalTrackerImpl);