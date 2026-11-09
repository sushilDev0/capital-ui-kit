import { useMemo } from "react";
import { cx } from "../../lib/cx"; // Ensure this matches your project structure
import {
  resolveStepStatuses,
  summarizeTimeline,
  formatTimelineTime,
  formatRelativeTime,
} from "./helpers";
import type { PaymentTimelineProps, TimelineStep } from "./schema";
import "./PaymentTimeline.css";

/* ---------- Icon helpers (inline SVGs, zero deps) ---------- */

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function DotIcon() {
  return <span className="pt-dot" aria-hidden="true" />;
}

/* ---------- Step Node (shared across variants) ---------- */

interface StepNodeProps {
  step: TimelineStep;
  locale: string;
  showTimestamps: boolean;
  variant: "vertical" | "horizontal" | "compact" | "card";
}

function StepNode({ step, locale, showTimestamps, variant }: StepNodeProps) {
  const time = showTimestamps ? formatTimelineTime(step.timestamp, locale) : null;
  const relTime = showTimestamps ? formatRelativeTime(step.timestamp, locale) : null;

  const isCompleted = step.status === "completed";
  const isCurrent = step.status === "current";
  const isFailed = step.status === "failed";

  return (
    <li
      className={cx(
        "pt-step",
        isCompleted && "pt-step--completed",
        isCurrent && "pt-step--current",
        isFailed && "pt-step--failed"
      )}
      data-status={step.status}
    >
      {/* Connector line (vertical variant) */}
      {variant === "vertical" && <div className="pt-step__connector" aria-hidden="true" />}

      {/* Node / Icon */}
      <div className="pt-step__node" aria-hidden="true">
        {isCompleted && <CheckIcon />}
        {isFailed && <XIcon />}
        {isCurrent && <DotIcon />}
        {step.status === "upcoming" && <span className="pt-dot pt-dot--muted" />}
      </div>

      {/* Content */}
      <div className="pt-step__content">
        <div className="pt-step__header">
          <span className="pt-step__label">{step.label}</span>
          {time && <time className="pt-step__time">{time}</time>}
        </div>
        {step.description && (
          <p className="pt-step__description">{step.description}</p>
        )}
        {relTime && variant === "card" && (
          <p className="pt-step__reltime">{relTime}</p>
        )}
        {step.meta && (
          <dl className="pt-step__meta">
            {Object.entries(step.meta).map(([k, v]) => (
              <div key={k} className="pt-step__meta-row">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </li>
  );
}

/* ---------- Main Component ---------- */

export function PaymentTimeline({
  steps,
  variant = "vertical",
  currentStepId,
  failedStepId,
  locale = "en-US",
  showTimestamps = true,
  theme = "dark",
  className,
  onStepClick,
}: PaymentTimelineProps) {
  const resolvedSteps = useMemo(
    () => resolveStepStatuses(steps, currentStepId, failedStepId),
    [steps, currentStepId, failedStepId]
  );

  const summary = useMemo(() => summarizeTimeline(resolvedSteps), [resolvedSteps]);

  const rootClass = cx(
    "payment-timeline",
    `payment-timeline--${variant}`,
    className
  );

  /* ---------- Card Variant ---------- */
  if (variant === "card") {
    const current = summary.currentStep;
    return (
      <div className={rootClass} data-theme={theme}>
        <div className="pt-card">
          <div className="pt-card__badge" data-status={current?.status ?? "upcoming"}>
            {summary.isFailed ? (
              <><XIcon /> Failed</>
            ) : current?.status === "completed" ? (
              <><CheckIcon /> Complete</>
            ) : (
              <>● In Progress</>
            )}
          </div>
          <h3 className="pt-card__title">
            {current?.label ?? steps[steps.length - 1]?.label ?? "Payment"}
          </h3>
          {current?.description && (
            <p className="pt-card__description">{current.description}</p>
          )}
          {current?.timestamp && (
            <p className="pt-card__time">
              Updated {formatRelativeTime(current.timestamp, locale)}
            </p>
          )}
        </div>

        <ol className="pt-card__steps">
          {resolvedSteps.map((step) => (
            <StepNode
              key={step.id}
              step={step}
              locale={locale}
              showTimestamps={showTimestamps}
              variant="card"
            />
          ))}
        </ol>
      </div>
    );
  }

  /* ---------- Other Variants ---------- */
  return (
    <div className={rootClass} data-theme={theme} aria-live="polite">
      <ol className="pt-list" role="list">
        {resolvedSteps.map((step) => (
          <div
            key={step.id}
            className="pt-list__item"
            onClick={onStepClick ? () => onStepClick(step) : undefined}
            role={onStepClick ? "button" : undefined}
            tabIndex={onStepClick ? 0 : undefined}
            onKeyDown={
              onStepClick
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onStepClick(step);
                    }
                  }
                : undefined
            }
          >
            <StepNode
              step={step}
              locale={locale}
              showTimestamps={showTimestamps}
              variant={variant}
            />
          </div>
        ))}
      </ol>
    </div>
  );
}

export default PaymentTimeline