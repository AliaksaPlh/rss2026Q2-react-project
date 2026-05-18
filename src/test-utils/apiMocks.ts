import { vi } from 'vitest';

type FetchResponseOptions = {
  ok?: boolean;
  status?: number;
  jsonData?: unknown;
};

export function createFetchResponse({
  ok = true,
  status = 200,
  jsonData = {},
}: FetchResponseOptions = {}): Response {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(jsonData),
  } as unknown as Response;
}
