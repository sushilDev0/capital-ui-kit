import { afterEach, describe, expect, it, vi } from "vitest";
import { generateLayout } from "./generate";

const config = { provider: "gemini", apiKey: "TEST-SECRET-KEY", model: "test-model" } as const;

const good = { sections: [{ component: "CurrencyCounter", props: { value: 5, currency: "USD" } }] };
const badProps = { sections: [{ component: "CurrencyCounter", props: { value: 5, currency: "RUPEES" } }] };

function geminiReply(text: string, input = 100, output = 10) {
  return new Response(
    JSON.stringify({
      candidates: [{ content: { parts: [{ text }] } }],
      usageMetadata: { promptTokenCount: input, candidatesTokenCount: output },
    }),
    { status: 200 },
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("generateLayout", () => {
  it("returns a layout on the first valid reply", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(geminiReply(JSON.stringify(good))));
    const result = await generateLayout("balance", config);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.attempts).toBe(1);
  });

  it("accepts JSON wrapped in code fences", async () => {
    const fenced = "```json\n" + JSON.stringify(good) + "\n```";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(geminiReply(fenced)));
    const result = await generateLayout("balance", config);
    expect(result.ok).toBe(true);
  });

  it("retries with the validation error and adds up token usage", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(geminiReply(JSON.stringify(badProps), 100, 10))
      .mockResolvedValueOnce(geminiReply(JSON.stringify(good), 120, 12));
    vi.stubGlobal("fetch", fetchMock);

    const result = await generateLayout("balance", config);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.attempts).toBe(2);
    expect(result.usage).toEqual({ inputTokens: 220, outputTokens: 22 });

    const secondBody = JSON.parse(fetchMock.mock.calls[1][1].body as string);
    expect(secondBody.contents[0].parts[0].text).toContain("validation errors");
  });

  it("returns ok:false after the retries are used up", async () => {
    vi.stubGlobal("fetch", vi.fn().mockImplementation(async () => geminiReply("this is not json at all")));
    const result = await generateLayout("balance", config);
    expect(result.ok).toBe(false);
  });

  it("surfaces HTTP errors without leaking the API key", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response("unauthorized", { status: 401 })));
    const error = await generateLayout("balance", config).then(
      () => null,
      (e: Error) => e,
    );
    expect(error).not.toBeNull();
    expect(error?.message).toContain("401");
    expect(error?.message).not.toContain("TEST-SECRET-KEY");
  });

  it("sends the key in a header, not in the URL or the prompt", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(geminiReply(JSON.stringify(good)));
    vi.stubGlobal("fetch", fetchMock);
    await generateLayout("balance", config);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).not.toContain("TEST-SECRET-KEY");
    expect(String(init.body)).not.toContain("TEST-SECRET-KEY");
    expect(init.headers["x-goog-api-key"]).toBe("TEST-SECRET-KEY");
  });
});
