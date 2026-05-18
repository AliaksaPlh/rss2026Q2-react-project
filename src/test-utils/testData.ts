import type { Pokemon, PokemonShort } from '../types/pokemonTypes';
import type { Movie } from '../types/movieTypes';

export const createPokemonMock = (
  overrides: Partial<Pokemon> = {}
): Pokemon => ({
  id: 25,
  name: 'pikachu',
  sprites: {
    front_default: 'https://example.com/pikachu.png',
    other: {
      dream_world: {
        front_default: 'https://example.com/pikachu-dream.png',
      },
    },
  },
  height: 4,
  weight: 60,
  types: [{ type: { name: 'electric' } }],
  ...overrides,
});

export const pikachuMock = createPokemonMock();

export const charmanderMock = createPokemonMock({
  id: 4,
  name: 'charmander',
  sprites: {
    front_default: 'https://example.com/charmander.png',
    other: {
      dream_world: {
        front_default: 'https://example.com/charmander-dream.png',
      },
    },
  },
  height: 6,
  weight: 85,
  types: [{ type: { name: 'fire' } }],
});

export const squirtleMock = createPokemonMock({
  id: 7,
  name: 'squirtle',
  sprites: {
    front_default: 'https://example.com/squirtle.png',
    other: {
      dream_world: {
        front_default: 'https://example.com/squirtle-dream.png',
      },
    },
  },
  height: 5,
  weight: 90,
  types: [{ type: { name: 'water' } }],
});

export const pokemonPageResponseMock: { results: PokemonShort[] } = {
  results: [
    { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/pikachu' },
    { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/charmander' },
  ],
};

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