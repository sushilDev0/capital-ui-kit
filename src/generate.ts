import { promptCatalog } from "./catalog";
import { validateLayout, type LayoutResult } from "./layout";
import { createClient, type ProviderConfig } from "./providers";

export type GenerateResult =
  | {
      ok: true;
      layout: unknown;
      attempts: number;
      usage: { inputTokens: number; outputTokens: number };
    }
  | { ok: false; error: string };

function buildSystemPrompt(): string {
  // $schema is noise for the model, so drop it to save tokens
  const catalog = promptCatalog.map(({ props, ...rest }) => {
    const { $schema: _ignored, ...cleanProps } = props as Record<string, unknown>;
    return { ...rest, props: cleanProps };
  });

  return [
    "You build page layouts from a fixed catalog of fintech UI components.",
    'Reply with JSON only, in this exact shape: {"sections":[{"component":"<name>","props":{...}}]}',
    "Rules:",
    "- Use only component names from the catalog.",
    "- Use only props listed in that component's schema. Omit a prop to use its default.",
    "- Never include function props such as onSearch or isLoading.",
    "- For visual styling requests (colors, backgrounds, sizes, spacing), use the classNames prop of the right component with standard Tailwind CSS v4 utility classes, e.g. {\"root\":\"bg-red-900\"}. Never invent other props for styling.",
    "- All data must be obviously fake placeholders. Never output real-looking card numbers or personal data.",
    "- Pick the components that fit the request, in a sensible top-to-bottom order.",
    "",
    "Catalog:",
    JSON.stringify(catalog),
  ].join("\n");
}

function collectProblems(result: LayoutResult): string[] {
  if (!result.ok) return [result.error];
  return result.sections.flatMap((s, i) =>
    s.ok ? [] : [`Section ${i + 1} (${s.component}): ${s.error}`],
  );
}

// Some models wrap JSON in ```json fences or add a sentence around it
function extractJson(text: string): unknown {
  const cleaned = text.replace(/```(?:json)?/gi, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found");
  return JSON.parse(cleaned.slice(start, end + 1));
}

export async function generateLayout(
  prompt: string,
  config: ProviderConfig,
  maxRetries = 1,
): Promise<GenerateResult> {
  const client = createClient(config);
  const system = buildSystemPrompt();
  const usage = { inputTokens: 0, outputTokens: 0 };

  let user = prompt;
  let lastError = "";

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const reply = await client.complete({ system, user });
    usage.inputTokens += reply.usage?.inputTokens ?? 0;
    usage.outputTokens += reply.usage?.outputTokens ?? 0;

    let json: unknown;
    try {
      json = extractJson(reply.text);
    } catch {
      lastError = "The reply was not valid JSON.";
      user = `${prompt}\n\nYour previous reply was not valid JSON. Return corrected JSON only.`;
      continue;
    }

    const problems = collectProblems(validateLayout(json));
    if (problems.length === 0) {
      return { ok: true, layout: json, attempts: attempt + 1, usage };
    }

    lastError = problems.join("\n");
    user = `${prompt}\n\nYour previous reply had these validation errors:\n${lastError}\nReturn corrected JSON only.`;
  }

  return { ok: false, error: lastError };
}
