import { postJson } from "./http";
import type { LlmClient, ProviderConfig } from "./types";

export function openaiCompatibleClient(
  { apiKey, model, baseUrl }: ProviderConfig & { baseUrl: string },
  jsonMode = true,
): LlmClient {
  return {
    async complete({ system, user }) {
      const data = await postJson(
        `${baseUrl}/chat/completions`,
        { authorization: `Bearer ${apiKey}` },
        {
          model,
          temperature: 0.2,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
        },
      );
      return {
        text: data.choices?.[0]?.message?.content ?? "",
        usage: {
          inputTokens: data.usage?.prompt_tokens,
          outputTokens: data.usage?.completion_tokens,
        },
      };
    },
  };
}
