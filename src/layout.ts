import { z } from "zod";
import { componentMeta, type ComponentName } from "./meta";

export const layoutSchema = z.object({
  sections: z
    .array(
      z.object({
        component: z.string(),
        props: z.record(z.string(), z.unknown()).default({}),
      }),
    )
    .min(1)
    .max(20),
});
export type Layout = z.input<typeof layoutSchema>;

const isComponentName = (name: string): name is ComponentName =>
  Object.hasOwn(componentMeta, name);

export type ValidatedSection =
  | {
      ok: true;
      component: ComponentName;
      props: Record<string, unknown>; // validated, with defaults filled in
      input: Record<string, unknown>; // only the props that were actually provided
    }
  | { ok: false; component: string; error: string };

export type LayoutResult =
  | { ok: true; sections: ValidatedSection[] }
  | { ok: false; error: string };

export function validateLayout(input: unknown): LayoutResult {
  const parsed = layoutSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: z.prettifyError(parsed.error) };

  const sections = parsed.data.sections.map((s): ValidatedSection => {
    if (!isComponentName(s.component)) {
      return { ok: false, component: s.component, error: `Unknown component "${s.component}"` };
    }
    const result = componentMeta[s.component].schema.safeParse(s.props);
    if (!result.success) {
      return { ok: false, component: s.component, error: z.prettifyError(result.error) };
    }
    const parsedProps = result.data as Record<string, unknown>;
    // keep only props the model set (and the schema knows), not filled-in defaults
    const providedInput = Object.fromEntries(
      Object.entries(s.props).filter(([key]) => key in parsedProps),
    );
    return { ok: true, component: s.component, props: parsedProps, input: providedInput };
  });

  return { ok: true, sections };
}
