import { postJson } from "./http";
import type { LlmClient, ProviderConfig } from "./types";

export function geminiClient({ apiKey, model, baseUrl }: ProviderConfig): LlmClient {
  const root = baseUrl ?? "https://generativelanguage.googleapis.com/v1beta";
  return {
    async complete({ system, user }) {
      const data = await postJson(
        `${root}/models/${model}:generateContent`,
        { "x-goog-api-key": apiKey },
        {
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: user }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
        },
      );
      const text = (data.candidates?.[0]?.content?.parts ?? [])
        .map((p: { text?: string }) => p.text ?? "")
        .join("");
      return {
        text,
        usage: {
          inputTokens: data.usageMetadata?.promptTokenCount,
          outputTokens: data.usageMetadata?.candidatesTokenCount,
        },
      };
    },
  };
}
