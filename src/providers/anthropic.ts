import { postJson } from "./http";
import type { LlmClient, ProviderConfig } from "./types";

export function anthropicClient({ apiKey, model, baseUrl }: ProviderConfig): LlmClient {
  const root = baseUrl ?? "https://api.anthropic.com/v1";
  return {
    async complete({ system, user }) {
      const data = await postJson(
        `${root}/messages`,
        { "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
        {
          model,
          max_tokens: 4096,
          temperature: 0.2,
          system,
          messages: [{ role: "user", content: user }],
        },
      );
      const text = (data.content ?? [])
        .filter((b: { type: string }) => b.type === "text")
        .map((b: { text: string }) => b.text)
        .join("");
      return {
        text,
        usage: { inputTokens: data.usage?.input_tokens, outputTokens: data.usage?.output_tokens },
      };
    },
  };
}
