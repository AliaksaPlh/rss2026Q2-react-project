import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Movie, MoviesResponse } from '../../types/movieTypes';
import { TMDB_IMAGE_BASE_URL } from '../../consts';

const BASE_URL = 'https://api.themoviedb.org/3';
const MOVIES_PER_PAGE = 16;

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
  const status = typeof response.status === 'number' ? response.status : 0;
  return movieErrorMessage(status, query);
};

export const movieApi = createApi({
  reducerPath: 'movieApi',
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
    }),

    searchMovies: builder.query<Movie[], { title: string; page?: number }>({
      query: ({ title, page = 1 }) =>
        `search/movie?query=${encodeURIComponent(title.trim())}&page=${page}&language=en-US`,
      transformResponse: transformListResponse,
      transformErrorResponse: (response, _meta, arg) =>
        transformListError(response, arg.title.trim()),
    }),

    getMovieById: builder.query<Movie, string>({
      query: (id) => `movie/${encodeURIComponent(id)}?language=en-US`,
      transformResponse: (movie: Movie) => addPosterUrl(movie),
      transformErrorResponse: (response) => transformListError(response),
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

  if ('data' in error && typeof error.data === 'string') {
    return error.data;
  }

  if ('message' in error && typeof error.message === 'string') {
    return error.message;
  }

  return 'Unknown error occurred';
}
