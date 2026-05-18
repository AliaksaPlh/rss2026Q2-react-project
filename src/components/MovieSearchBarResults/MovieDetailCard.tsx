import type { Movie } from '../../types/movieTypes';
import { TMDB_IMAGE_BASE_URL } from '../../consts';

type Props = {
  movie: Movie;
};

export function MovieDetailCard({ movie }: Props) {
  return (
    <article className="mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-3xl border border-slate-700/80 bg-gradient-to-b from-slate-800/90 to-slate-900/95 p-6 shadow-card ring-1 ring-white/5 sm:p-8">
        <div className="relative mx-auto mb-6 flex aspect-square max-h-100 items-center justify-center rounded-2xl bg-slate-950/50 ring-1 ring-inset ring-white/5">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,63,94,0.12),transparent_55%)]"
            aria-hidden
          />
          <img
            src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            className="relative z-10 h-100 w-100 object-contain drop-shadow-2xl"
          />
        </div>
        <h2 className="mb-1 text-center text-2xl font-bold capitalize tracking-tight text-white">
          {movie.title}
        </h2>
        <p className="text-center text-slate-400">{movie.overview}</p>
        <p className="text-center text-slate-400">{movie.release_date}</p>
        <p className="text-center text-slate-400">{movie.vote_average}</p>
        <p className="text-center text-slate-400">
          Popularity: {movie.popularity}
        </p>
        <p className="text-center text-slate-400">
          Language: {movie.original_language.toUpperCase()}
        </p>
      </div>
    </article>
  );
}
