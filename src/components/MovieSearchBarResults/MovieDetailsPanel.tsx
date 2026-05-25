import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchMovieById } from '../../api/movieApi';
import type { Movie } from '../../types/movieTypes';
import Loader from '../Loader/Loader';
import { MovieDetailCard } from './MovieDetailCard';
import Button from '../ui/Button/Button';

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

    const selectedMovieId = movieId;
    let cancelled = false;

    async function loadMovieDetails() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchMovieById(selectedMovieId);

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
      <Button onClick={handleClose} className="mb-4">
        Close
      </Button>

      {loading && <Loader />}

      {error && <p className="text-sm font-semibold text-rose-300">{error}</p>}

      {!loading && !error && movie && <MovieDetailCard movie={movie} />}
    </div>
  );
}
