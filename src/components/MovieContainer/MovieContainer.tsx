import { useCallback, useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { SearchBar } from '../SearchBar/SearchBar';
import MovieResults from '../MovieSearchBarResults/MovieResults';
import ErrorBoundaryButton from '../ErrorBoundary/ErrorBoundaryButton';
import Pagination from '../Pagination/Pagination';
import { searchMoviesByTitle } from '../../api/movieApi';
import type { Movie } from '../../types/movieTypes';

export function MovieContainer() {
  const [term, setTerm] = useState(
    () => localStorage.getItem('searchTerm') || ''
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const beginFetchReset = useCallback((nextPage?: number) => {
    setLoading(true);
    setError(null);
    setAllMovies([]);
    if (nextPage !== undefined) {
      setCurrentPage(nextPage);
    }
  }, []);

  const failFetch = useCallback((error: unknown) => {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';
    setError(message);
    setLoading(false);
  }, []);

  const loadMovies = useCallback(
    async (query: string, page = 1) => {
      beginFetchReset(page);

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
      const savedTerm = localStorage.getItem('searchTerm') || '';
      const trimmed = savedTerm.trim();

      try {
        const movies = await searchMoviesByTitle(trimmed, 1);

        if (!cancelled) {
          setAllMovies(movies);
          setCurrentPage(1);
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
    loadMovies(trimmed, 1);
  };

  const handlePageChange = (newPage: number) => {
    loadMovies(term.trim().toLowerCase(), newPage);
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

      <MovieResults
        loading={loading}
        error={error}
        currentMovie={null}
        allMovies={allMovies}
      />

      {!loading && !error && allMovies.length > 0 && (
        <Pagination currentPage={currentPage} onPageChange={handlePageChange} />
      )}

      <div className="flex justify-center border-t border-slate-800/80 pt-8">
        <ErrorBoundaryButton />
      </div>
    </div>
  );
}

export default MovieContainer;
