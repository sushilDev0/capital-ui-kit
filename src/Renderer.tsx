import { useMemo, type ComponentType } from "react";
import { registry } from "./registry";
import { validateLayout, type Layout } from "./layout";
import type { ComponentName } from "./meta";

type RendererProps = {
  layout: Layout | unknown;
  /** Runtime props the developer wires up, e.g. { DebouncedSearch: { onSearch } } */
  runtime?: Partial<Record<ComponentName, Record<string, unknown>>>;
};

function ErrorBox({ title, message }: { title: string; message: string }) {
  return (
    <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
      <p className="font-semibold">{title}</p>
      <pre className="mt-1 whitespace-pre-wrap font-mono text-xs">{message}</pre>
    </div>
  );
}

export function Renderer({ layout, runtime = {} }: RendererProps) {
  const result = useMemo(() => validateLayout(layout), [layout]);

  if (!result.ok) return <ErrorBox title="Invalid layout" message={result.error} />;

  return (
    <div className="flex flex-col gap-4">
      {result.sections.map((section, i) => {
        if (!section.ok) {
          return <ErrorBox key={i} title={`Section ${i + 1}: ${section.component}`} message={section.error} />;
        }
        const Component = registry[section.component].component as unknown as ComponentType<Record<string, unknown>>;
        return <Component key={i} {...section.props} {...runtime[section.component]} />;
      })}
    </div>
  );
}