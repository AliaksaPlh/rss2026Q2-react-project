import type { Movie } from '../../types/movieTypes';
import { MovieListItem } from './MovieListItem';

type Props = {
  movies: Movie[];
};

export function MovieList({ movies }: Props) {
  return (
    <section className="w-full">
      <div className="mb-5 flex flex-col gap-2 text-left sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white sm:text-xl">
            Movies
          </h3>
        </div>
      </div>
      <ul className="grid gap-4 overflow-y-auto pb-4  sm:grid-cols-2  ">
        {movies.map((movie) => (
          <li key={movie.id}>
            <MovieListItem movie={movie} />
          </li>
        ))}
      </ul>
    </section>
  );
}
