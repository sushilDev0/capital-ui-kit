import { geminiClient } from "./gemini";
import { anthropicClient } from "./anthropic";
import { openaiCompatibleClient } from "./openaiCompatible";
import type { LlmClient, ProviderConfig, ProviderId } from "./types";

export * from "./types";

const baseUrls = {
  openai: "https://api.openai.com/v1",
  deepseek: "https://api.deepseek.com",
  openrouter: "https://openrouter.ai/api/v1",
  ollama: "http://localhost:11434/v1",
} as const;

export const providerIds: ProviderId[] = [
  "gemini",
  "anthropic",
  "openai",
  "deepseek",
  "openrouter",
  "ollama",
];

export function createClient(config: ProviderConfig): LlmClient {
  switch (config.provider) {
    case "gemini":
      return geminiClient(config);
    case "anthropic":
      return anthropicClient(config);
    default:
      return openaiCompatibleClient({
        ...config,
        baseUrl: config.baseUrl ?? baseUrls[config.provider],
      });
  }
}
