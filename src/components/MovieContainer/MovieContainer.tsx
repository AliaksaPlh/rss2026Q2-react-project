import { useCallback, useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { SearchBar } from '../SearchBar/SearchBar';
import MovieResults from '../MovieSearchBarResults/MovieResults';
import ErrorBoundaryButton from '../ErrorBoundary/ErrorBoundaryButton';
import Pagination from '../Pagination/Pagination';
import { searchMoviesByTitle } from '../../api/movieApi';
import type { Movie } from '../../types/movieTypes';
import useLocalStorage from '../../hooks/uselocalStorage';
import { Outlet, useSearchParams } from 'react-router-dom';
import SelectedMovieList from '../../store/SelectedMovieList';

export function MovieContainer() {
  const { getLocalStorage, setLocalStorage } = useLocalStorage('searchTerm');
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = Number(searchParams.get('page')) || 1;
  const currentPage = pageFromUrl > 0 ? pageFromUrl : 1;
  const [term, setTerm] = useState(() => getLocalStorage());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const selectedMovieId = searchParams.get('details');

  const beginFetchReset = useCallback(() => {
    setLoading(true);
    setError(null);
    setAllMovies([]);
  }, []);

  const failFetch = useCallback((error: unknown) => {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';
    setError(message);
    setLoading(false);
  }, []);

  const loadMovies = useCallback(
    async (query: string, page = 1) => {
      beginFetchReset();

      try {
        const movies = await searchMoviesByTitle(query, page);
        setAllMovies(movies);
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
      const savedTerm = getLocalStorage();
      const trimmed = savedTerm.trim();
      setLoading(true);
      setError(null);
      setAllMovies([]);
      try {
        const movies = await searchMoviesByTitle(trimmed, currentPage);

        if (!cancelled) {
          setAllMovies(movies);
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
  }, [currentPage, failFetch, getLocalStorage]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
  };

  const handleSearch = () => {
    const trimmed = term.trim().toLowerCase();
    const persisted = getLocalStorage();
    if (trimmed === persisted && currentPage === 1) {
      return;
    }
    setLocalStorage(trimmed);
    if (currentPage === 1) {
      loadMovies(trimmed, 1);
    } else {
      setSearchParams({ page: '1' });
    }
  };
  const closeDetailsPanel = () => {
    if (!selectedMovieId) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('details');
    setSearchParams(nextParams);
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: String(newPage) });
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
      <div className="relative" onClick={closeDetailsPanel}>
        <MovieResults
          loading={loading}
          error={error}
          currentMovie={null}
          allMovies={allMovies}
        />

        {!loading && !error && allMovies.length > 0 && (
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}

        {selectedMovieId && (
          <aside className="fixed right-4 top-24 z-50 max-h-[calc(100vh-7rem)] w-[24rem] overflow-y-auto rounded-2xl border border-slate-800/80 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-md">
            <Outlet />
          </aside>
        )}
      </div>
      <div className="flex justify-center border-t border-slate-800/80 pt-8">
        <ErrorBoundaryButton />
      </div>
      <SelectedMovieList />
    </div>
  );
}

export default MovieContainer;
