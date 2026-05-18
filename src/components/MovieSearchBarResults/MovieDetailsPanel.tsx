import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchMovieById } from '../../api/movieApi';
import type { Movie } from '../../types/movieTypes';
import Loader from '../Loader/Loader';
import { MovieDetailCard } from './MovieDetailCard';

export function MovieDetailsPanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const movieId = searchParams.get('details');

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) {
      return;
    }

    let cancelled = false;

    async function loadMovieDetails() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchMovieById(movieId);

        if (!cancelled) {
          setMovie(data);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : 'Unknown error occurred'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadMovieDetails();

    return () => {
      cancelled = true;
    };
  }, [movieId]);

  const handleClose = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('details');
    setSearchParams(nextParams);
  };

  if (!movieId) {
    return null;
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClose}
        className="mb-4 rounded-lg border border-slate-700 px-3 py-1 text-sm text-slate-200"
      >
        Close
      </button>

      {loading && <Loader />}

      {error && <p className="text-sm font-semibold text-rose-300">{error}</p>}

      {!loading && !error && movie && <MovieDetailCard movie={movie} />}
    </div>
  );
}
