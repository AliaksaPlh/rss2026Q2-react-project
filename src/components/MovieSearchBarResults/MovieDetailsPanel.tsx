import { useSearchParams } from 'react-router-dom';
import {
  useGetMovieByIdQuery,
  getRtkQueryErrorMessage,
} from '../../api/rtk/movieApi';
import Loader from '../Loader/Loader';
import { MovieDetailCard } from './MovieDetailCard';
import Button from '../ui/Button/Button';

export function MovieDetailsPanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const movieId = searchParams.get('details');

  const { data: movie, isLoading, error } = useGetMovieByIdQuery(movieId ?? '', {
    skip: !movieId,
  });

  const errorMessage = getRtkQueryErrorMessage(error);

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

      {isLoading && <Loader />}

      {errorMessage && (
        <p className="text-sm font-semibold text-rose-300">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && movie && <MovieDetailCard movie={movie} />}
    </div>
  );
}
