export async function postJson(url: string, headers: Record<string, string>, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = (await res.text()).slice(0, 500);
    // Never include request headers here: they hold the API key
    throw new Error(`Provider returned ${res.status}: ${detail}`);
  }
  return res.json();
}
