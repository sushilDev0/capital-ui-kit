import {z} from 'zod';

export const TimelineStepSchema = z.object({
    id:z.string(),
    label:z.string(),
    description:z.string().optional(),
    timeStamp: z.union([z.string(), z.date().optional()]),
    status:z.enum(["completed","current","upcoming","failed"]).optional(),
  meta: z.record(z.string(), z.string()).optional(), 
})

export type TimelineStep = z.infer<typeof TimelineStepSchema>;

export const PaymentTimelinePropsSchema = z.object({
  steps: z.array(TimelineStepSchema),
  variant: z
    .enum(["vertical", "horizontal", "compact", "card"])
    .default("vertical"),
  currentStepId: z.string().optional(),
  failedStepId: z.string().optional(),
  locale: z.string().default("en-US"),
  showTimestamps: z.boolean().default(true),
  theme: z.enum(["dark", "light"]).default("dark"),
  className: z.string().optional(),
});

export type PaymentTimelineProps = z.infer<typeof PaymentTimelinePropsSchema> & {
  onStepClick?: (step: TimelineStep) => void;
};

export interface PaymentTimelineResult {
  currentStep: TimelineStep | null;
  isFailed: boolean;
  completedCount: number;
  totalCount: number;
}