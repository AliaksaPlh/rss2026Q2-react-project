import { useCallback, useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { fetchPokemonByName, fetchPokemonsPage } from '../../api/pokemonApi';
import { SearchBar } from '../SearchBar/SearchBar';
import PokemonResults from '../PokemonSearchBarResults/PokemonResults';
import type { Pokemon } from '../../types/pokemonTypes';
import ErrorBoundaryButton from '../ErrorBoundary/ErrorBoundaryButton';
import Pagination from '../Pagination/Pagination';

export function PokemonContainer() {
  const [term, setTerm] = useState(
    () => localStorage.getItem('searchTerm') || ''
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon | null>(null);
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const beginFetchReset = useCallback((nextPage?: number) => {
    setLoading(true);
    setError(null);
    setCurrentPokemon(null);
    setAllPokemons([]);
    if (nextPage !== undefined) setCurrentPage(nextPage);
  }, []);

  const failFetch = useCallback((error: unknown) => {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';
    setError(message);
    setLoading(false);
  }, []);

  const loadPokemonByName = useCallback(
    async (name: string) => {
      beginFetchReset();

      try {
        const data = await fetchPokemonByName(name);
        setCurrentPokemon(data);
        setLoading(false);
      } catch (error: unknown) {
        failFetch(error);
      }
    },
    [beginFetchReset, failFetch]
  );

  const loadPokemonList = useCallback(
    async (page: number = 1) => {
      beginFetchReset(page);

      try {
        const pokemons = await fetchPokemonsPage(page);
        setAllPokemons(pokemons);
        setLoading(false);
      } catch (error: unknown) {
        failFetch(error);
      }
    },
    [beginFetchReset, failFetch]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadInitialData() {
      const savedTerm = localStorage.getItem('searchTerm') || '';
      const trimmed = savedTerm.trim();

      try {
        if (trimmed) {
          const data = await fetchPokemonByName(trimmed);

          if (!cancelled) {
            setCurrentPokemon(data);
          }
        } else {
          const pokemons = await fetchPokemonsPage(1);

          if (!cancelled) {
            setAllPokemons(pokemons);
          }
        }
      } catch (error: unknown) {
        if (!cancelled) {
          failFetch(error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadInitialData();

    return () => {
      cancelled = true;
    };
  }, [failFetch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
  };

  const handleSearch = () => {
    const trimmed = term.trim().toLowerCase();
    const persisted = localStorage.getItem('searchTerm') ?? '';
    if (trimmed === persisted) {
      return;
    }
    localStorage.setItem('searchTerm', trimmed);

    if (trimmed === '') {
      loadPokemonList();
    } else {
      loadPokemonByName(trimmed);
    }
  };

  const handlePageChange = (newPage: number) => {
    loadPokemonList(newPage);
  };

  return (
    <div className="flex w-full flex-col items-stretch gap-10">
      <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 shadow-card backdrop-blur-md sm:p-6">
        <SearchBar
          value={term}
          onChange={handleChange}
          onSearch={handleSearch}
        />
      </section>

      <PokemonResults
        loading={loading}
        error={error}
        currentPokemon={currentPokemon}
        allPokemons={allPokemons}
      />

      {!currentPokemon && allPokemons.length > 0 && (
        <Pagination currentPage={currentPage} onPageChange={handlePageChange} />
      )}

      <div className="flex justify-center border-t border-slate-800/80 pt-8">
        <ErrorBoundaryButton />
      </div>
    </div>
  );
}

export default PokemonContainer;
