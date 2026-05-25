import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { clearAllSelectedMovies, selectSelectedMovies } from './slice';
import Button from '../components/ui/Button/Button';

const SelectedMovieList = () => {
  const dispatch = useAppDispatch();
  const selectedMovies = useAppSelector(selectSelectedMovies);

  const escapeCsvValue = (value: string | number | null) => {
    const stringValue = String(value ?? '');
    return `"${stringValue.replaceAll('"', '""')}"`;
  };

  const handleClear = () => {
    dispatch(clearAllSelectedMovies());
  };

  const handleDownloadJson = () => {
    const data = selectedMovies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      original_language: movie.original_language,
      popularity: movie.popularity,
      details_url: `${window.location.origin}/movies?details=${movie.id}`,
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${selectedMovies.length}_items.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    const headers = [
      'id',
      'name',
      'description',
      'release_date',
      'rating',
      'language',
      'popularity',
      'details_url',
    ];

    const rows = selectedMovies.map((movie) => [
      movie.id,
      movie.title,
      movie.overview,
      movie.release_date,
      movie.vote_average,
      movie.original_language,
      movie.popularity,
      `${window.location.origin}/movies?details=${movie.id}`,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map(escapeCsvValue).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${selectedMovies.length}_items.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };
  if (selectedMovies.length === 0) {
    return null;
  }

  return (
    <aside className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 rounded-2xl border border-amber-400/40 bg-slate-950/95 p-4 text-slate-100 shadow-2xl backdrop-blur-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold" aria-live="polite">
          Selected movies: {selectedMovies.length}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={handleClear}>
            Unselect all
          </Button>
          <Button type="button" variant="primary" onClick={handleDownloadCsv}>
            Download CSV
          </Button>
          <Button type="button" variant="outline" onClick={handleDownloadJson}>
            JSON
          </Button>
        </div>
      </div>

      <ul className="mt-3 flex flex-wrap gap-2">
        {selectedMovies.map((movie) => (
          <li
            key={movie.id}
            className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-medium text-amber-200"
          >
            {movie.title}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SelectedMovieList;
