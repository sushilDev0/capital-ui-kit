import { generateLayout } from "../src/generate";
import { generateCode } from "../src/codegen";
import { providerIds, type ProviderId } from "../src/providers";

const provider = process.env.LLM_PROVIDER as ProviderId | undefined;
const apiKey = process.env.LLM_API_KEY;
const model = process.env.LLM_MODEL;

if (!provider || !providerIds.includes(provider) || !apiKey || !model) {
  console.error(`Set LLM_PROVIDER (${providerIds.join(", ")}), LLM_API_KEY and LLM_MODEL in .env`);
  process.exit(1);
}

const prompt =
  process.argv.slice(2).join(" ") ||
  "A dashboard header with a total balance counter, a masked credit card, and a search bar";
const result = await generateLayout(prompt, { provider, apiKey, model });
console.log(JSON.stringify(result, null, 2));

if (result.ok) {
  const code = generateCode(result.layout);
  if (code.ok) {
    console.log("\n--- generated code ---\n");
    console.log(code.code);
  }
}
