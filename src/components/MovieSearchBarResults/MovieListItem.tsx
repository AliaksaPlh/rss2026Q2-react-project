import type { ChangeEvent } from 'react';
import type { Movie } from '../../types/movieTypes';
import { TMDB_IMAGE_BASE_URL } from '../../consts.ts';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { selectSelectedMovieIds, toggleSelectedMovie } from '../../store/slice';

type Props = {
  movie: Movie;
};

export function MovieListItem({ movie }: Props) {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const selectedMovieIds = useAppSelector(selectSelectedMovieIds);

  const isSelected = selectedMovieIds.includes(movie.id);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    dispatch(toggleSelectedMovie(movie));
  };

  const nextParams = new URLSearchParams(searchParams);
  nextParams.set('details', String(movie.id));
  return (
    <div className="relative">
      <label className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-slate-100 ">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          onClick={(event) => event.stopPropagation()}
          className="h-4 w-4 accent-amber-400"
          aria-label={`Select ${movie.title}`}
        />
        Select
      </label>
      <Link to={`?${nextParams.toString()}`} className="block">
        <div className="group flex h-[260px] w-full overflow-hidden rounded-3xl bg-slate-900/70 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
          <div className="flex flex-1 flex-col justify-center p-8 pt-16">
            <strong className="mb-4 text-3xl font-bold text-slate-100">
              {movie.title}
            </strong>
            <p className="line-clamp-5 text-base leading-7 text-slate-300">
              {movie.original_language.toUpperCase()} | {movie.release_date} |
              Popularity: {movie.popularity}
            </p>
            <span className="mt-6 text-sm text-slate-400">
              ⭐ {movie.vote_average.toFixed(1)}
            </span>
          </div>

          <img
            src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            className="h-full w-[180px] object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
    </div>
  );
}
