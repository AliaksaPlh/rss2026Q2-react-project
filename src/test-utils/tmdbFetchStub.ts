import { vi } from 'vitest';
import { createFetchResponse } from './apiMocks';
import type { Movie } from '../types/movieTypes';
import { batmanMock } from './testData';

export function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') {
    return input;
  }
  if (input instanceof URL) {
    return input.href;
  }
  return input.url;
}

export function moviesListJson(results: Movie[]) {
  return {
    page: 1,
    results: results,
    total_pages: 1,
    total_results: results.length,
  };
}

type StubOptions = {
  trending?: Movie[];
  search?: Movie[];
  /** Map decoded lowercase query string → list results */
  searchByQuery?: Record<string, Movie[]>;
  detail?: Movie;
  listError?: { ok: false; status: number };
  /** Reject every request (e.g. network failure). */
  reject?: Error;
};

/**
 * Stubs global fetch for TMDB URLs used by RTK Query movieApi.
 */
export function stubTmdbFetch(options: StubOptions | (() => StubOptions) = {}) {
  const getOpts = typeof options === 'function' ? options : () => options;

  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = requestUrl(input);
    const opts = getOpts();

    if (opts.reject) {
      throw opts.reject;
    }

    if (opts.listError && (url.includes('/trending/movie') || url.includes('/search/movie'))) {
      return createFetchResponse(opts.listError);
    }

    if (url.includes('/search/movie')) {
      const rawQuery = new URL(url).searchParams.get('query') ?? '';
      const key = decodeURIComponent(rawQuery).trim().toLowerCase();
      const fromMap = opts.searchByQuery?.[key];
      const list = fromMap ?? opts.search ?? [batmanMock];
      return createFetchResponse({
        jsonData: moviesListJson(list),
      });
    }

    if (url.includes('/trending/movie')) {
      return createFetchResponse({
        jsonData: moviesListJson(opts.trending ?? [batmanMock]),
      });
    }

    if (url.includes('/3/movie/') && !url.includes('/search/movie')) {
      const movie = opts.detail ?? batmanMock;
      return createFetchResponse({ jsonData: movie });
    }

    return createFetchResponse({ ok: false, status: 404 });
  });

  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}
