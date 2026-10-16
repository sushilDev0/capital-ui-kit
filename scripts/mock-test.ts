import { generateLayout } from "../src/generate";

type Call = { url: string; headers: Record<string, string>; body: any };
const calls: Call[] = [];
let queue: Array<() => Response> = [];

globalThis.fetch = (async (url: any, init: any) => {
  calls.push({ url: String(url), headers: init.headers, body: JSON.parse(init.body) });
  return queue.shift()!();
}) as typeof fetch;

const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status });
const bad = { sections: [{ component: "CurrencyCounter", props: { value: 5, currency: "RUPEES" } }] };
const good = { sections: [{ component: "CurrencyCounter", props: { value: 5, currency: "USD" } }] };

// Gemini: attempt 1 invalid props in fenced JSON, attempt 2 valid
queue = [
  () => json({ candidates: [{ content: { parts: [{ text: "```json\n" + JSON.stringify(bad) + "\n```" }] } }], usageMetadata: { promptTokenCount: 100, candidatesTokenCount: 10 } }),
  () => json({ candidates: [{ content: { parts: [{ text: JSON.stringify(good) }] } }], usageMetadata: { promptTokenCount: 120, candidatesTokenCount: 12 } }),
];
const r1 = await generateLayout("balance", { provider: "gemini", apiKey: "SECRET-KEY", model: "m" });
console.log("gemini ok:", r1.ok, r1.ok && r1.attempts, r1.ok && JSON.stringify(r1.usage));
console.log("gemini url:", calls[0].url, "| header:", Object.keys(calls[0].headers).join(","));
console.log("retry prompt mentions error:", String(calls[1].body.contents[0].parts[0].text).includes("validation errors"));

// Anthropic
queue = [() => json({ content: [{ type: "text", text: "Here you go: " + JSON.stringify(good) }], usage: { input_tokens: 50, output_tokens: 5 } })];
const r2 = await generateLayout("balance", { provider: "anthropic", apiKey: "SECRET-KEY", model: "m" });
const a = calls[calls.length - 1];
console.log("anthropic ok:", r2.ok, "|", a.url, "|", Object.keys(a.headers).sort().join(","), "| has system:", typeof a.body.system === "string");

// OpenAI-compatible (deepseek)
queue = [() => json({ choices: [{ message: { content: JSON.stringify(good) } }], usage: { prompt_tokens: 60, completion_tokens: 6 } })];
const r3 = await generateLayout("balance", { provider: "deepseek", apiKey: "SECRET-KEY", model: "m" });
const d = calls[calls.length - 1];
console.log("deepseek ok:", r3.ok, "|", d.url, "| json mode:", d.body.response_format?.type, "| auth header present:", "authorization" in d.headers);

// Failure after retries returns ok:false
queue = [() => json({ choices: [{ message: { content: "not json" } }] }), () => json({ choices: [{ message: { content: "still no" } }] })];
const r4 = await generateLayout("balance", { provider: "openai", apiKey: "SECRET-KEY", model: "m" });
console.log("garbage replies ->", JSON.stringify(r4));

// HTTP error must not leak the key
queue = [() => new Response("unauthorized", { status: 401 })];
try { await generateLayout("balance", { provider: "gemini", apiKey: "SECRET-KEY", model: "m" }); }
catch (e) { const msg = (e as Error).message; console.log("http error:", msg, "| leaks key:", msg.includes("SECRET-KEY")); }
