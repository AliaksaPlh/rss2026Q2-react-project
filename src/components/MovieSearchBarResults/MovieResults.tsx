import React from 'react';
import Loader from '../Loader/Loader';
import { MovieDetailCard } from './MovieDetailCard';
import { MovieList } from './MovieList';
import type { Movie } from '../../types/movieTypes';

type Props = {
  loading: boolean;
  error: string | null;
  currentMovie: Movie | null;
  allMovies: Movie[];
};

const MovieResults: React.FC<Props> = ({
  loading,
  error,
  currentMovie,
  allMovies,
}) => {
  if (loading) {
    return <Loader />;
  }

  if (currentMovie) {
    return <MovieDetailCard movie={currentMovie} />;
  }

  if (allMovies.length > 0) {
    return <MovieList movies={allMovies} />;
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-rose-500/40 bg-rose-950/30 px-5 py-4 text-center shadow-lg shadow-rose-900/20"
      >
        <p className="text-sm font-semibold text-rose-200">{error}</p>
      </div>
    );
  }

  return null;
};

export default MovieResults;
