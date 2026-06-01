import { configureStore } from '@reduxjs/toolkit';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import { createFetchResponse } from '../../test-utils/apiMocks';
import { createMovieMock, batmanMock } from '../../test-utils/testData';
import { moviesListJson, requestUrl } from '../../test-utils/tmdbFetchStub';
import { getRtkQueryErrorMessage, movieApi } from './movieApi';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function createApiStore() {
  return configureStore({
    reducer: {
      [movieApi.reducerPath]: movieApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(movieApi.middleware),
  });
}

function createTextResponse({
  ok = true,
  status = 200,
  text = '',
}: {
  ok?: boolean;
  status?: number;
  text?: string;
} = {}): Response {
  const make = () =>
    ({
      ok,
      status,
      headers: new Headers(),
      text: vi.fn().mockResolvedValue(text),
      json: vi.fn().mockRejectedValue(new Error('json should not be used')),
      clone: () => make(),
    }) as unknown as Response;

  return make();
}

describe('movieApi RTK Query endpoints', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches trending movies with headers, poster urls, and list limit', async () => {
    const movies = Array.from({ length: 20 }, (_, index) =>
      createMovieMock({ id: index + 1, title: `Movie ${index + 1}` })
    );
    const fetchMock = vi
      .fn()
      .mockResolvedValue(createFetchResponse({ jsonData: moviesListJson(movies) }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await createApiStore().dispatch(
      movieApi.endpoints.getTrendingMovies.initiate({ page: 2 })
    );

    expect(result.data).toHaveLength(16);
    expect(result.data?.[0]).toEqual({
      ...movies[0],
      posterUrl: `${IMAGE_BASE_URL}${movies[0].poster_path}`,
    });

    const request = fetchMock.mock.calls[0][0] as Request;
    expect(requestUrl(request)).toBe(
      `${BASE_URL}/trending/movie/day?language=en-US&page=2`
    );
    expect(request.headers.get('accept')).toBe('application/json');
    expect(request.headers.get('authorization')).toMatch(/^Bearer /);
  });

  it('returns an empty list for malformed list responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(createFetchResponse({ jsonData: { results: null } }))
    );

    const result = await createApiStore().dispatch(
      movieApi.endpoints.getTrendingMovies.initiate({})
    );

    expect(result.data).toEqual([]);
  });

  it('searches movies by encoded title and provides query-specific errors', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        createFetchResponse({ jsonData: moviesListJson([batmanMock]) })
      )
      .mockResolvedValueOnce(createFetchResponse({ ok: false, status: 404 }));
    vi.stubGlobal('fetch', fetchMock);

    const successful = await createApiStore().dispatch(
      movieApi.endpoints.searchMovies.initiate({
        title: 'batman returns',
        page: 3,
      })
    );
    const failed = await createApiStore().dispatch(
      movieApi.endpoints.searchMovies.initiate({ title: 'missing', page: 1 })
    );

    expect(successful.data?.[0].title).toBe('Batman Begins');
    expect(requestUrl(fetchMock.mock.calls[0][0] as Request)).toBe(
      `${BASE_URL}/search/movie?query=batman%20returns&page=3&language=en-US`
    );
    expect(failed.error).toBe('Movie "missing" not found. Status: 404');
  });

  it('fetches a movie by encoded id and handles missing poster path', async () => {
    const movieWithoutPoster = createMovieMock({
      id: 42,
      title: 'No Poster',
      poster_path: null,
      posterUrl: '',
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValue(createFetchResponse({ jsonData: movieWithoutPoster }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await createApiStore().dispatch(
      movieApi.endpoints.getMovieById.initiate('movie 42')
    );

    expect(result.data).toEqual({
      ...movieWithoutPoster,
      posterUrl: '',
    });
    expect(requestUrl(fetchMock.mock.calls[0][0] as Request)).toBe(
      `${BASE_URL}/movie/movie%2042?language=en-US`
    );
  });

  it('maps server, request, redirect, fetch, and parsing errors', async () => {
    const store = createApiStore();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(createFetchResponse({ ok: false, status: 503 }))
      .mockResolvedValueOnce(createFetchResponse({ ok: false, status: 401 }))
      .mockResolvedValueOnce(createFetchResponse({ ok: false, status: 302 }))
      .mockRejectedValueOnce(new Error('Network failed'))
      .mockResolvedValueOnce(createTextResponse({ text: '{not-json' }));
    vi.stubGlobal('fetch', fetchMock);

    const serverError = await store.dispatch(
      movieApi.endpoints.getTrendingMovies.initiate({})
    );
    const requestError = await store.dispatch(
      movieApi.endpoints.getMovieById.initiate('1')
    );
    const fallbackError = await store.dispatch(
      movieApi.endpoints.getTrendingMovies.initiate({ page: 2 })
    );
    const fetchError = await store.dispatch(
      movieApi.endpoints.getTrendingMovies.initiate({ page: 3 })
    );
    const parsingError = await store.dispatch(
      movieApi.endpoints.getTrendingMovies.initiate({ page: 4 })
    );

    expect(serverError.error).toBe(
      'Server is temporarily unavailable. Please try again later. Status: 503.'
    );
    expect(requestError.error).toBe(
      'Request failed. Status: 401. Please try again.'
    );
    expect(fallbackError.error).toBe(
      'Something went wrong. Status: 302. Please try again.'
    );
    expect(fetchError.error).toContain('Network failed');
    expect(parsingError.error).toContain('SyntaxError');
  });
});

describe('getRtkQueryErrorMessage', () => {
  it('normalizes supported RTK Query error shapes', () => {
    expect(getRtkQueryErrorMessage(undefined)).toBeNull();
    expect(getRtkQueryErrorMessage('Plain error')).toBe('Plain error');
    expect(getRtkQueryErrorMessage(42 as never)).toBe('Unknown error occurred');
    expect(
      getRtkQueryErrorMessage({
        status: 'FETCH_ERROR',
        error: 'Fetch failed',
      } as FetchBaseQueryError)
    ).toBe('Fetch failed');
    expect(
      getRtkQueryErrorMessage({
        status: 'FETCH_ERROR',
        error: '',
      } as FetchBaseQueryError)
    ).toBe('Unknown error occurred');
    expect(
      getRtkQueryErrorMessage({
        status: 400,
        data: 'Bad request',
      } as FetchBaseQueryError)
    ).toBe('Bad request');
    expect(
      getRtkQueryErrorMessage({
        message: 'Serialized error',
      } as SerializedError)
    ).toBe('Serialized error');
  });
});
