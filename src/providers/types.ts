export type CompletionRequest = { system: string; user: string };

export type CompletionResult = {
  text: string;
  usage?: { inputTokens?: number; outputTokens?: number };
};

export type LlmClient = {
  complete(req: CompletionRequest): Promise<CompletionResult>;
};

export type ProviderId =
  | "gemini"
  | "anthropic"
  | "openai"
  | "deepseek"
  | "openrouter"
  | "ollama";

export type ProviderConfig = {
  provider: ProviderId;
  apiKey: string; // for ollama, any non-empty string
  model: string;
  baseUrl?: string; // override the default endpoint
};
