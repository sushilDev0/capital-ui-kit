import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { generateLayout } from "../src/generate";
import { parseThinking, providerIds, type ProviderId } from "../src/providers";

type Case = { id: string; prompt: string; expect: string[]; forbid?: string[]; mustInclude?: string[] };

type Row = {
  id: string;
  valid: boolean;
  correct: boolean | null; // null when the case has no expected components
  safe: boolean;
  attempts: number;
  inputTokens: number;
  outputTokens: number;
  ms: number;
  note: string;
};

const provider = process.env.LLM_PROVIDER as ProviderId | undefined;
const apiKey = process.env.LLM_API_KEY;
const model = process.env.LLM_MODEL;
const baseUrl = process.env.LLM_BASE_URL || undefined;
const delayMs = Number(process.env.EVAL_DELAY_MS ?? 8000); // free tiers allow few requests per minute
const priceIn = Number(process.env.EVAL_PRICE_IN_PER_M ?? NaN); // optional: USD per 1M input tokens
const priceOut = Number(process.env.EVAL_PRICE_OUT_PER_M ?? NaN); // optional: USD per 1M output tokens

if (!provider || !providerIds.includes(provider) || !apiKey || !model) {
  console.error(`Set LLM_PROVIDER (${providerIds.join(", ")}), LLM_API_KEY and LLM_MODEL in .env`);
  process.exit(1);
}

const cases: Case[] = JSON.parse(
  readFileSync(fileURLToPath(new URL("../evals/prompts.json", import.meta.url)), "utf8"),
);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function usedComponents(layout: unknown): string[] {
  const sections = (layout as { sections?: Array<{ component?: unknown }> }).sections ?? [];
  return sections.map((s) => String(s.component));
}

async function runCase(c: Case): Promise<Row> {
  const started = Date.now();
  const row: Row = {
    id: c.id,
    valid: false,
    correct: c.expect.length > 0 ? false : null,
    safe: true,
    attempts: 0,
    inputTokens: 0,
    outputTokens: 0,
    ms: 0,
    note: "",
  };

  for (let tryNo = 0; tryNo < 2; tryNo++) {
    try {
      const result = await generateLayout(c.prompt, {
        provider: provider!,
        apiKey: apiKey!,
        model: model!,
        baseUrl,
        thinking: parseThinking(process.env.LLM_THINKING),
      });
      row.ms = Date.now() - started;
      if (result.ok) {
        row.valid = true;
        row.attempts = result.attempts;
        row.inputTokens = result.usage.inputTokens;
        row.outputTokens = result.usage.outputTokens;
        const used = usedComponents(result.layout);
        const text = JSON.stringify(result.layout);
        if (c.expect.length > 0) {
          row.correct =
            c.expect.every((name) => used.includes(name)) &&
            (c.mustInclude ?? []).every((word) => text.toLowerCase().includes(word.toLowerCase()));
        }
        if (c.forbid?.some((bad) => text.includes(bad))) row.safe = false;
      } else {
        row.note = result.error.split("\n")[0].slice(0, 80);
      }
      return row;
    } catch (error) {
      const message = (error as Error).message;
      if (message.includes(" 429") && tryNo === 0) {
        console.log(`  rate limited, waiting 30s before retrying ${c.id}...`);
        await sleep(30_000);
        continue;
      }
      row.ms = Date.now() - started;
      row.note = message.slice(0, 80);
      return row;
    }
  }
  return row;
}

const rows: Row[] = [];
for (const [i, c] of cases.entries()) {
  console.log(`[${i + 1}/${cases.length}] ${c.id}`);
  rows.push(await runCase(c));
  if (i < cases.length - 1) await sleep(delayMs);
}

const pct = (n: number, d: number) => (d === 0 ? "n/a" : `${Math.round((n / d) * 100)}%`);
const validRows = rows.filter((r) => r.valid);
const expectRows = rows.filter((r) => r.correct !== null);
const totalIn = rows.reduce((sum, r) => sum + r.inputTokens, 0);
const totalOut = rows.reduce((sum, r) => sum + r.outputTokens, 0);
const hasPrices = Number.isFinite(priceIn) && Number.isFinite(priceOut);
const cost = hasPrices ? (totalIn / 1e6) * priceIn + (totalOut / 1e6) * priceOut : null;

const summary = [
  `| Metric | Result |`,
  `|---|---|`,
  `| Valid layouts | ${validRows.length}/${rows.length} (${pct(validRows.length, rows.length)}) |`,
  `| Valid on first try | ${validRows.filter((r) => r.attempts === 1).length}/${rows.length} |`,
  `| Right components chosen | ${expectRows.filter((r) => r.correct).length}/${expectRows.length} |`,
  `| Safety (no forbidden text) | ${rows.filter((r) => r.safe).length}/${rows.length} |`,
  `| Avg tokens per prompt (in / out) | ${Math.round(totalIn / rows.length)} / ${Math.round(totalOut / rows.length)} |`,
  `| Avg latency | ${Math.round(rows.reduce((s, r) => s + r.ms, 0) / rows.length)} ms |`,
  ...(cost !== null ? [`| Estimated cost for the run | $${cost.toFixed(4)} |`] : []),
].join("\n");

const mark = (value: boolean | null) => (value === null ? "-" : value ? "yes" : "no");
const detail = [
  `| Case | Valid | Right components | Safe | Attempts | Tokens in/out | ms | Note |`,
  `|---|---|---|---|---|---|---|---|`,
  ...rows.map(
    (r) =>
      `| ${r.id} | ${mark(r.valid)} | ${mark(r.correct)} | ${mark(r.safe)} | ${r.attempts} | ${r.inputTokens}/${r.outputTokens} | ${r.ms} | ${r.note} |`,
  ),
].join("\n");

const date = new Date().toISOString().slice(0, 10);
const report = `# Eval: ${provider} / ${model} (${date})\n\n${summary}\n\n${detail}\n`;

console.log(`\n${report}`);

const outDir = fileURLToPath(new URL("../evals/results/", import.meta.url));
mkdirSync(outDir, { recursive: true });
const fileName = `${provider}_${model.replace(/[^a-zA-Z0-9.-]/g, "-")}_${date}.md`;
writeFileSync(`${outDir}${fileName}`, report);
console.log(`Saved to evals/results/${fileName}`);
