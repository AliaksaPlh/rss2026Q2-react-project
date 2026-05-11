import { afterEach, describe, expect, it, vi } from 'vitest';
import { createFetchResponse } from '../test-utils/apiMocks';
import {
  charmanderMock,
  pikachuMock,
  pokemonPageResponseMock,
} from '../test-utils/testData';
import { fetchPokemonByName, fetchPokemonsPage } from './pokemonApi';

describe('pokemonApi', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches a pokemon by name successfully', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(createFetchResponse({ jsonData: pikachuMock }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchPokemonByName('Mr Mime')).resolves.toEqual(pikachuMock);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/Mr%20Mime'
    );
  });

  it('throws a not found error when pokemon by name returns 404', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(createFetchResponse({ ok: false, status: 404 }))
    );

    await expect(fetchPokemonByName('missingno')).rejects.toThrow(
      'Pokémon "missingno" not found. Status: 404'
    );
  });

  it('fetches a pokemon page and its details successfully', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        createFetchResponse({ jsonData: pokemonPageResponseMock })
      )
      .mockResolvedValueOnce(createFetchResponse({ jsonData: pikachuMock }))
      .mockResolvedValueOnce(createFetchResponse({ jsonData: charmanderMock }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchPokemonsPage(2, 2)).resolves.toEqual([
      pikachuMock,
      charmanderMock,
    ]);

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'https://pokeapi.co/api/v2/pokemon?limit=2&offset=2'
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://pokeapi.co/api/v2/pokemon/pikachu'
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      'https://pokeapi.co/api/v2/pokemon/charmander'
    );
  });

  it('throws an error when the pokemon page request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(createFetchResponse({ ok: false, status: 500 }))
    );

    await expect(fetchPokemonsPage(1)).rejects.toThrow(
      'Server is temporarily unavailable. Please try again later.'
    );
  });

  it('throws an error when a pokemon detail request fails', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        createFetchResponse({ jsonData: pokemonPageResponseMock })
      )
      .mockResolvedValueOnce(createFetchResponse({ ok: false, status: 503 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchPokemonsPage(1)).rejects.toThrow(
      'Server is temporarily unavailable. Please try again later. Status: 503.'
    );
  });
});
