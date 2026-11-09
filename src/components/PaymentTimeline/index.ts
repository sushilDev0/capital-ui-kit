
// ✅ 2. Export the TypeScript Types from the schema
export type {
  PaymentTimelineProps,
  PaymentTimelineResult,
  TimelineStep,
} from "./schema";

// ✅ 3. Export the Zod Schemas (for your JSON layout engine)
export { TimelineStepSchema, PaymentTimelinePropsSchema } from "./schema";

// ✅ 4. Export the Headless Helpers (for developers who want custom UI)
export {
  resolveStepStatuses,
  summarizeTimeline,
  formatTimelineTime,
  formatRelativeTime,
} from "./helpers";