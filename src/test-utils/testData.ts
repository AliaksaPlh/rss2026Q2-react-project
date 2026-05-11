import type { Pokemon, PokemonShort } from '../types/pokemonTypes';

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