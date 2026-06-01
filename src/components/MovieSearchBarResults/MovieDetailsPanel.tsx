import { useSearchParams } from 'react-router-dom';
import {
  movieApi,
  useGetMovieByIdQuery,
  getRtkQueryErrorMessage,
} from '../../api/rtk/movieApi';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import Loader from '../Loader/Loader';
import { MovieDetailCard } from './MovieDetailCard';
import Button from '../ui/Button/Button';

export function MovieDetailsPanel() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const movieId = searchParams.get('details');

  const { data: movie, isLoading, error } = useGetMovieByIdQuery(movieId ?? '', {
    skip: !movieId,
  });

  const errorMessage = getRtkQueryErrorMessage(error);

  const handleClose = () => {
    if (movieId) {
      dispatch(movieApi.util.invalidateTags([{ type: 'Movie', id: movieId }]));
    }

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
