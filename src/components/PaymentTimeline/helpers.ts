import type { TimelineStep, PaymentTimelineResult } from "./schema";

/*
 * Derives status for each step if not explicitly provided.
 * If currentStepId is set, everything before is "completed",
 * the matching step is "current", and everything after is "upcoming".
 */
export function resolveStepStatuses(
    steps: TimelineStep[],
    currentStepId?: string,
    failedStepId?: string
): TimelineStep[] {
    // Calculate currentIndex once before the loop (Performance Optimization: O(N))
    const currentIndex = currentStepId
        ? steps.findIndex((s) => s.id === currentStepId)
        : -1;

    return steps.map((step, stepIndex) => {
        // 1. Explicit status always wins
        if (step.status) return step;

        // 2. Check for explicit failure
        if (failedStepId && step.id === failedStepId) {
            return { ...step, status: "failed" as const };
        }

        // 3. Check for the current active step
        if (currentStepId && step.id === currentStepId) {
            return { ...step, status: "current" as const };
        }

        // 4. Derive status based on position relative to the current step
        if (currentIndex === -1) {
            return { ...step, status: "upcoming" as const };
        }

        return {
            ...step,
            status: stepIndex < currentIndex ? ("completed" as const) : ("upcoming" as const),
        };
    });
}

export function summarizeTimeline(resolvedSteps: TimelineStep[]): PaymentTimelineResult {
    const currentStep = resolvedSteps.find((s) => s.status === "current") ?? null;
    const isFailed = resolvedSteps.some((s) => s.status === "failed");
    const completedCount = resolvedSteps.filter((s) => s.status === "completed").length;

    return {
        currentStep,
        isFailed,
        completedCount,
        totalCount: resolvedSteps.length,
    };
}

/**
 * Formats a timestamp as a short absolute date string (e.g., "Nov 7, 10:30 AM").
 */
export function formatTimelineTime(
    timestamp: string | Date | undefined,
    locale: string
): string | null {
    if (!timestamp) return null;

    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
    if (isNaN(date.getTime())) return null;

    return new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

/**
 * Formats a timestamp as a relative time string (e.g., "2 hours ago").
 */
export function formatRelativeTime(
    timestamp: string | Date | undefined,
    locale: string
): string | null {
    if (!timestamp) return null;

    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
    if (isNaN(date.getTime())) return null;

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    const diffMs = date.getTime() - Date.now();
    const diffMins = Math.round(diffMs / 60000);

    if (Math.abs(diffMins) < 60) {
        return rtf.format(diffMins, "minute");
    }

    const diffHours = Math.round(diffMins / 60);
    if (Math.abs(diffHours) < 24) {
        return rtf.format(diffHours, "hour");
    }

    const diffDays = Math.round(diffHours / 24);
    return rtf.format(diffDays, "day");
}