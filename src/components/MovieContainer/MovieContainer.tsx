import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import {
  useGetTrendingMoviesQuery,
  useSearchMoviesQuery,
  getRtkQueryErrorMessage,
} from '../../api/rtk/movieApi';
import useLocalStorage from '../../hooks/uselocalStorage';
import SelectedMovieList from '../../store/SelectedMovieList';
import { SearchBar } from '../SearchBar/SearchBar';
import MovieResults from '../MovieSearchBarResults/MovieResults';
import ErrorBoundaryButton from '../ErrorBoundary/ErrorBoundaryButton';
import Pagination from '../Pagination/Pagination';

export function MovieContainer() {
  const { getLocalStorage, setLocalStorage } = useLocalStorage('searchTerm');
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = Number(searchParams.get('page')) || 1;
  const currentPage = pageFromUrl > 0 ? pageFromUrl : 1;
  const selectedMovieId = searchParams.get('details');

  const [term, setTerm] = useState(() => getLocalStorage());
  const [searchQuery, setSearchQuery] = useState(() =>
    getLocalStorage().trim().toLowerCase()
  );

  const trimmedQuery = searchQuery.trim();
  const trending = useGetTrendingMoviesQuery(
    { page: currentPage },
    { skip: Boolean(trimmedQuery) }
  );
  const search = useSearchMoviesQuery(
    { title: trimmedQuery, page: currentPage },
    { skip: !trimmedQuery }
  );

  const { data, isLoading, isFetching, error } = trimmedQuery ? search : trending;
  const loading = isLoading || isFetching;
  const allMovies = loading ? [] : (data ?? []);
  const errorMessage = getRtkQueryErrorMessage(error);

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
    setSearchQuery(trimmed);

    if (currentPage !== 1) {
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
          error={errorMessage}
          currentMovie={null}
          allMovies={allMovies}
        />

        {!loading && !errorMessage && allMovies.length > 0 && (
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
