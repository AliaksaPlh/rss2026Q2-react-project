import { vi } from 'vitest';

type FetchResponseOptions = {
  ok?: boolean;
  status?: number;
  jsonData?: unknown;
};

function buildResponse(
  ok: boolean,
  status: number,
  getBodyText: () => Promise<string>
): Response {
  const textImpl = vi.fn(getBodyText);
  const jsonImpl = vi.fn(async () => {
    const raw = await getBodyText();
    return raw.length ? JSON.parse(raw) : null;
  });

  const make = () =>
    ({
      ok,
      status,
      headers: new Headers(),
      text: textImpl,
      json: jsonImpl,
      clone: () => make(),
    }) as unknown as Response;

  return make();
}

export function createFetchResponse({
  ok = true,
  status = 200,
  jsonData = {},
}: FetchResponseOptions = {}): Response {
  const bodyText = JSON.stringify(jsonData);
  return buildResponse(ok, status, () => Promise.resolve(bodyText));
}

/** Same body can be read from the instance or from `clone()` (RTK Query / fetchBaseQuery). */
export function createDeferredFetchResponse(
  jsonPromise: Promise<unknown>
): Response {
  return buildResponse(true, 200, async () => {
    const data = await jsonPromise;
    return JSON.stringify(data);
  });
}
