import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawn } from "node:child_process";
import { platform } from "node:os";
import { generateLayout } from "../src/generate";
import { generateCode } from "../src/codegen";
import { providerIds, type ProviderId } from "../src/providers";

// Run with: npm run generate -- "your prompt"   (the npm script loads .env)
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

// Generated pages go here (git-ignored). "../components" is the import path from this folder.
const outFile = join(process.cwd(), "src", "generated", "GeneratedPage.tsx");

const main = async (): Promise<void> => {
  const result = await generateLayout(prompt, { provider, apiKey, model });

  if (!result.ok) {
    console.error(`❌ Layout generation failed:\n${result.error}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `✅ Valid layout after ${result.attempts} attempt(s) · tokens in/out: ${result.usage.inputTokens}/${result.usage.outputTokens}`,
  );

  const code = generateCode(result.layout, { importBase: "../components" });
  if (!code.ok) {
    console.error(`❌ Code generation failed:\n${code.error}`);
    process.exitCode = 1;
    return;
  }
  for (const note of code.skipped) console.log(`⚠️ Skipped: ${note}`);

  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, code.code, "utf8");
  console.log(`✅ Saved to ${outFile}`);

  // Optional: open the file. Set CAPITAL_EDITOR=none to turn this off.
  const editor = process.env.CAPITAL_EDITOR ?? (platform() === "win32" ? "code.cmd" : "code");
  if (editor === "none") return;

  // A missing editor does not throw: spawn reports it through the "error" event.
  const child = spawn(editor, [outFile], { stdio: "ignore", detached: true });
  child.on("error", () => {
    console.log(`⚠️ Could not open "${editor}" automatically. Open the file yourself.`);
  });
  child.unref();
};

main().catch((error: unknown) => {
  // Only the message is printed: provider errors never contain the API key.
  console.error(`❌ ${(error as Error).message}`);
  process.exit(1);
});