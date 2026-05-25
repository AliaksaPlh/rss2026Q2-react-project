import type { Movie, MoviesResponse } from '../types/movieTypes';
import { TMDB_IMAGE_BASE_URL } from '../consts.ts';

const BASE_URL = 'https://api.themoviedb.org/3';
const MOVIES_PER_PAGE = 16;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
};

function handleMovieResponseError(response: Response, query?: string): never {
  const status = response.status;

  if (status === 404 && query) {
    throw new Error(`Movie "${query}" not found. Status: ${status}`);
  }
  if (status >= 500) {
    throw new Error(
      `Server is temporarily unavailable. Please try again later. Status: ${status}.`
    );
  }
  if (status >= 400) {
    throw new Error(`Request failed. Status: ${status}. Please try again.`);
  }
  throw new Error(`Something went wrong. Status: ${status}. Please try again.`);
}

function addPosterUrl(movie: Movie): Movie {
  return {
    ...movie,
    posterUrl: movie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
      : '',
  };
}

async function fetchMovies(url: string, query?: string): Promise<Movie[]> {
  const response = await fetch(url, options);

  if (!response.ok) {
    handleMovieResponseError(response, query);
  }

  const data = (await response.json()) as MoviesResponse;

  return data.results.slice(0, MOVIES_PER_PAGE).map(addPosterUrl);
}

export async function fetchTrendingMovies(page = 1): Promise<Movie[]> {
  return fetchMovies(
    `${BASE_URL}/trending/movie/day?language=en-US&page=${page}`
  );
}

export async function searchMoviesByTitle(
  title: string,
  page = 1
): Promise<Movie[]> {
  const query = title.trim();

  if (!query) {
    return fetchTrendingMovies(page);
  }

  return fetchMovies(
    `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}&language=en-US`,
    query
  );
}

export async function fetchMovieById(id: string): Promise<Movie> {
  const response = await fetch(
    `${BASE_URL}/movie/${encodeURIComponent(id)}?language=en-US`,
    options
  );

  if (!response.ok) {
    handleMovieResponseError(response);
  }

  const movie = (await response.json()) as Movie;
  return addPosterUrl(movie);
}
