import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Movie, MoviesResponse } from '../../types/movieTypes';
import { TMDB_IMAGE_BASE_URL } from '../../consts';

const BASE_URL = 'https://api.themoviedb.org/3';
const MOVIES_PER_PAGE = 16;

/** RTK Query cache TTL (seconds) */
const rawCacheTtlSeconds = Number(import.meta.env.VITE_RTK_QUERY_CACHE_SECONDS);
const keepUnusedDataFor =
  Number.isFinite(rawCacheTtlSeconds) && rawCacheTtlSeconds >= 0
    ? rawCacheTtlSeconds
    : 60;

function movieErrorMessage(status: number, query?: string): string {
  if (status === 404 && query) {
    return `Movie "${query}" not found. Status: ${status}`;
  }
  if (status >= 500) {
    return `Server is temporarily unavailable. Please try again later. Status: ${status}.`;
  }
  if (status >= 400) {
    return `Request failed. Status: ${status}. Please try again.`;
  }
  return `Something went wrong. Status: ${status}. Please try again.`;
}

const addPosterUrl = (movie: Movie): Movie => ({
  ...movie,
  posterUrl: movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : '',
});

const transformListResponse = (data: MoviesResponse): Movie[] => {
  if (!Array.isArray(data?.results)) {
    return [];
  }

  return data.results.slice(0, MOVIES_PER_PAGE).map(addPosterUrl);
};

const transformListError = (
  response: FetchBaseQueryError,
  query?: string
): string => {
  if (response.status === 'FETCH_ERROR' && typeof response.error === 'string') {
    return response.error;
  }
  if (
    response.status === 'PARSING_ERROR' &&
    typeof response.error === 'string'
  ) {
    return response.error;
  }
  const status = typeof response.status === 'number' ? response.status : 0;
  return movieErrorMessage(status, query);
};

/**
 * TMDB via RTK Query: tag-based cache (`Movie`, `MovieList`), TTL from .env, refetch on focus/reconnect
 * Cached data is reused between navigations
 */
export const movieApi = createApi({
  reducerPath: 'movieApi',
  tagTypes: ['Movie', 'MovieList'],
  keepUnusedDataFor,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('accept', 'application/json');
      headers.set('Authorization', `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTrendingMovies: builder.query<Movie[], { page?: number }>({
      query: ({ page = 1 }) => `trending/movie/day?language=en-US&page=${page}`,
      transformResponse: transformListResponse,
      transformErrorResponse: (response) => transformListError(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map((m) => ({
                type: 'Movie' as const,
                id: String(m.id),
              })),
              { type: 'MovieList' as const, id: 'TRENDING' },
            ]
          : [{ type: 'MovieList' as const, id: 'TRENDING' }],
    }),

    searchMovies: builder.query<Movie[], { title: string; page?: number }>({
      query: ({ title, page = 1 }) =>
        `search/movie?query=${encodeURIComponent(title.trim())}&page=${page}&language=en-US`,
      transformResponse: transformListResponse,
      transformErrorResponse: (response, _meta, arg) =>
        transformListError(response, arg.title.trim()),
      providesTags: (result, _error, arg) => {
        const listId = `SEARCH:${arg.title}:${arg.page ?? 1}`;
        return result
          ? [
              ...result.map((m) => ({
                type: 'Movie' as const,
                id: String(m.id),
              })),
              { type: 'MovieList' as const, id: listId },
            ]
          : [{ type: 'MovieList' as const, id: listId }];
      },
    }),

    getMovieById: builder.query<Movie, string>({
      query: (id) => `movie/${encodeURIComponent(id)}?language=en-US`,
      transformResponse: (movie: Movie) => addPosterUrl(movie),
      transformErrorResponse: (response) => transformListError(response),
      providesTags: (_result, _error, id) => [{ type: 'Movie', id }],
    }),
  }),
});

export const {
  useGetTrendingMoviesQuery,
  useSearchMoviesQuery,
  useGetMovieByIdQuery,
} = movieApi;

export function getRtkQueryErrorMessage(
  error: FetchBaseQueryError | SerializedError | string | undefined
): string | null {
  if (!error) {
    return null;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (typeof error !== 'object') {
    return 'Unknown error occurred';
  }

  if ('status' in error && error.status === 'FETCH_ERROR' && 'error' in error) {
    const fetchErr = String((error as { error: string }).error);
    if (fetchErr) {
      return fetchErr;
    }
  }

  if ('data' in error && typeof error.data === 'string') {
    return error.data;
  }

  if ('message' in error && typeof error.message === 'string') {
    return error.message;
  }

  return 'Unknown error occurred';
}
