import type { Pokemon, PokemonShort } from '../types/pokemonTypes';

const BASE = 'https://pokeapi.co/api/v2';

export async function fetchPokemonByName(name: string): Promise<Pokemon> {
  const response = await fetch(`${BASE}/pokemon/${encodeURIComponent(name)}`);
  if (!response.ok) {
    const status = response.status;
    if (status === 404) {
      throw new Error(`Pokémon "${name}" not found. Status: ${status}`);
    }
    if (status >= 500) {
      throw new Error(
        `Server is temporarily unavailable. Please try again later. Status: ${status}.`
      );
    }
    if (status >= 400) {
      throw new Error(`Request failed. Status: ${status}. Please try again.`);
    }
    throw new Error(
      `Something went wrong. Status: ${status}. Please try again.`
    );
  }
  return response.json() as Promise<Pokemon>;
}

export async function fetchPokemonsPage(
  page: number,
  limit = 20
): Promise<Pokemon[]> {
  const offset = (page - 1) * limit;
  const response = await fetch(
    `${BASE}/pokemon?limit=${limit}&offset=${offset}`
  );
  if (!response.ok) {
    const status = response.status;
    if (status >= 500) {
      throw new Error(
        'Server is temporarily unavailable. Please try again later.'
      );
    }
    throw new Error(`Failed to fetch list. Status: ${status}`);
  }

  const data: { results: PokemonShort[] } = await response.json();
  return Promise.all(
    data.results.map(async (pokemon) => {
      const detailRes = await fetch(pokemon.url);
      if (!detailRes.ok) {
        const status = detailRes.status;
        if (status >= 500) {
          throw new Error(
            `Server is temporarily unavailable. Please try again later. Status: ${status}.`
          );
        }
        if (status >= 400) {
          throw new Error(
            `Request failed. Status: ${status}. Please try again.`
          );
        }
        throw new Error(
          `Something went wrong. Status: ${status}. Please try again.`
        );
      }
      return detailRes.json() as Promise<Pokemon>;
    })
  );
}
