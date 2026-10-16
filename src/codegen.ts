import { validateLayout } from "./layout";
import { componentMeta } from "./meta";

export type CodegenOptions = {
  importBase?: string; // where the components live in the target project
  exportName?: string;
};

export type CodegenResult =
  | { ok: true; code: string; dependencies: string[]; requires: string[]; skipped: string[] }
  | { ok: false; error: string };

// Callback props the developer wires up themselves
const runtimePlaceholders: Record<string, string> = {
  onSearch: "(query: string) => { /* TODO: connect your search */ }",
};

const plainString = /^[^"\\{}<>&\n\r]*$/;

function propToJsx(key: string, value: unknown): string {
  if (typeof value === "string") {
    return plainString.test(value) ? `${key}="${value}"` : `${key}={${JSON.stringify(value)}}`;
  }
  if (typeof value === "boolean") return value ? key : `${key}={false}`;
  return `${key}={${JSON.stringify(value)}}`;
}

function elementJsx(name: string, attrs: string[], indent: string): string {
  if (attrs.length === 0) return `${indent}<${name} />`;
  const oneLine = `${indent}<${name} ${attrs.join(" ")} />`;
  if (oneLine.length <= 80) return oneLine;
  const inner = attrs.map((a) => `${indent}  ${a}`).join("\n");
  return `${indent}<${name}\n${inner}\n${indent}/>`;
}

export function generateCode(layout: unknown, options: CodegenOptions = {}): CodegenResult {
  const { importBase = "./components/capital-ui", exportName = "GeneratedPage" } = options;

  const result = validateLayout(layout);
  if (!result.ok) return { ok: false, error: result.error };

  const used = new Set<string>();
  const dependencies = new Set<string>();
  const requires = new Set<string>();
  const skipped: string[] = [];
  const lines: string[] = [];

  result.sections.forEach((section, i) => {
    if (!section.ok) {
      skipped.push(`Section ${i + 1} (${section.component}): ${section.error}`);
      return;
    }
    const meta = componentMeta[section.component];
    used.add(section.component);
    meta.dependencies.forEach((d) => dependencies.add(d));
    meta.requires.forEach((r) => requires.add(r));

    const attrs = Object.entries(section.input).map(([key, value]) => propToJsx(key, value));
    for (const runtimeProp of meta.runtimeProps) {
      const placeholder = runtimePlaceholders[runtimeProp];
      if (placeholder) attrs.push(`${runtimeProp}={${placeholder}}`);
    }
    lines.push(elementJsx(section.component, attrs, "      "));
  });

  if (used.size === 0) return { ok: false, error: "No valid sections to generate." };

  const imports = [...used]
    .map((name) => `import { ${name} } from "${importBase}/${name}";`)
    .join("\n");

  const code = [
    imports,
    "",
    `export default function ${exportName}() {`,
    "  return (",
    '    <div className="flex flex-col gap-4">',
    ...lines,
    "    </div>",
    "  );",
    "}",
    "",
  ].join("\n");

  return {
    ok: true,
    code,
    dependencies: [...dependencies],
    requires: [...requires],
    skipped,
  };
}
