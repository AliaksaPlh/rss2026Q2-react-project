import type { Movie } from '../types/movieTypes';

export const createMovieMock = (overrides: Partial<Movie> = {}): Movie => ({
  id: 1,
  title: 'Batman Begins',
  overview: 'Bruce Wayne becomes Batman.',
  poster_path: '/batman.jpg',
  backdrop_path: '/batman-backdrop.jpg',
  release_date: '2005-06-15',
  vote_average: 8.2,
  posterUrl: 'https://image.tmdb.org/t/p/w500/batman.jpg',
  original_language: 'en',
  popularity: 123.45,
  ...overrides,
});

export const batmanMock = createMovieMock();

export const supermanMock = createMovieMock({
  id: 2,
  title: 'Superman',
  overview: 'Clark Kent becomes Superman.',
  poster_path: '/superman.jpg',
  backdrop_path: '/superman-backdrop.jpg',
  release_date: '1978-12-15',
  vote_average: 7.1,
  posterUrl: 'https://image.tmdb.org/t/p/w500/superman.jpg',
  original_language: 'en',
  popularity: 98.76,
});

export const duneMock = createMovieMock({
  id: 3,
  title: 'Dune',
  overview: 'Paul Atreides travels to Arrakis.',
  poster_path: '/dune.jpg',
  backdrop_path: '/dune-backdrop.jpg',
  release_date: '2021-10-22',
  vote_average: 7.8,
  posterUrl: 'https://image.tmdb.org/t/p/w500/dune.jpg',
  original_language: 'en',
  popularity: 87.65,
});
