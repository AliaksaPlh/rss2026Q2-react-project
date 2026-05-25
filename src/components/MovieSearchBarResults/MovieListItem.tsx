import type { Movie } from '../../types/movieTypes';
import { TMDB_IMAGE_BASE_URL } from '../../consts.ts';
import { Link, useSearchParams } from 'react-router-dom';

type Props = {
  movie: Movie;
};

export function MovieListItem({ movie }: Props) {
  const [searchParams] = useSearchParams();
  const nextParams = new URLSearchParams(searchParams);
  nextParams.set('details', String(movie.id));
  return (
    <Link to={`?${nextParams.toString()}`} className="block">
      <div className="group flex h-[260px] w-full overflow-hidden rounded-3xl bg-slate-900/70 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
        <div className="flex flex-1 flex-col justify-center p-8">
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
  );
}
