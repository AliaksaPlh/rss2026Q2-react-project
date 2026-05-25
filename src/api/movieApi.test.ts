import { afterEach, describe, expect, it, vi } from 'vitest';
import { createFetchResponse } from '../test-utils/apiMocks';
import { batmanMock, createMovieMock } from '../test-utils/testData';
import {
  fetchMovieById,
  fetchTrendingMovies,
  searchMoviesByTitle,
} from './movieApi';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function moviesResponse(results = [batmanMock]) {
  return {
    page: 1,
    results,
    total_pages: 1,
    total_results: results.length,
  };
}

function expectTmdbOptions(options: unknown) {
  expect(options).toEqual(
    expect.objectContaining({
      method: 'GET',
      headers: expect.objectContaining({
        accept: 'application/json',
        Authorization: expect.stringMatching(/^Bearer /),
      }),
    })
  );
}

describe('movieApi', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches trending movies with poster urls', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(createFetchResponse({ jsonData: moviesResponse() }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchTrendingMovies(2)).resolves.toEqual([
      {
        ...batmanMock,
        posterUrl: `${IMAGE_BASE_URL}${batmanMock.poster_path}`,
      },
    ]);

    expect(fetchMock).toHaveBeenCalledWith(
      `${BASE_URL}/trending/movie/day?language=en-US&page=2`,
      expect.any(Object)
    );
    expectTmdbOptions(fetchMock.mock.calls[0][1]);
  });

  it('searches movies by encoded title and page', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(createFetchResponse({ jsonData: moviesResponse() }));
    vi.stubGlobal('fetch', fetchMock);

    await searchMoviesByTitle('batman returns', 3);

    expect(fetchMock).toHaveBeenCalledWith(
      `${BASE_URL}/search/movie?query=batman%20returns&page=3&language=en-US`,
      expect.any(Object)
    );
  });

  it('loads trending movies when search query is empty', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(createFetchResponse({ jsonData: moviesResponse() }));
    vi.stubGlobal('fetch', fetchMock);

    await searchMoviesByTitle('   ', 4);

    expect(fetchMock).toHaveBeenCalledWith(
      `${BASE_URL}/trending/movie/day?language=en-US&page=4`,
      expect.any(Object)
    );
  });

  it('limits movie lists to sixteen results', async () => {
    const movies = Array.from({ length: 20 }, (_, index) =>
      createMovieMock({ id: index + 1, title: `Movie ${index + 1}` })
    );
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        createFetchResponse({ jsonData: moviesResponse(movies) })
      )
    );

    await expect(fetchTrendingMovies()).resolves.toHaveLength(16);
  });

  it('fetches a movie by id and handles missing poster path', async () => {
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

    await expect(fetchMovieById('movie 42')).resolves.toEqual({
      ...movieWithoutPoster,
      posterUrl: '',
    });
    expect(fetchMock).toHaveBeenCalledWith(
      `${BASE_URL}/movie/movie%2042?language=en-US`,
      expect.any(Object)
    );
  });

  it('throws a not found error when movie search returns 404', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(createFetchResponse({ ok: false, status: 404 }))
    );

    await expect(searchMoviesByTitle('missing')).rejects.toThrow(
      'Movie "missing" not found. Status: 404'
    );
  });

  it('throws a server error when TMDB returns 5xx', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(createFetchResponse({ ok: false, status: 503 }))
    );

    await expect(fetchTrendingMovies()).rejects.toThrow(
      'Server is temporarily unavailable. Please try again later. Status: 503.'
    );
  });

  it('throws a request error when TMDB returns 4xx without query context', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(createFetchResponse({ ok: false, status: 401 }))
    );

    await expect(fetchMovieById('1')).rejects.toThrow(
      'Request failed. Status: 401. Please try again.'
    );
  });

  it('throws a fallback error for unexpected non-ok statuses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(createFetchResponse({ ok: false, status: 302 }))
    );

    await expect(fetchTrendingMovies()).rejects.toThrow(
      'Something went wrong. Status: 302. Please try again.'
    );
  });
});
