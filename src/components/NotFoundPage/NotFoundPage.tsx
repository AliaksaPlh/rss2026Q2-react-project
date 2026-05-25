import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center">
      <div className="w-full rounded-3xl border border-slate-800/80 bg-slate-900/60 p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-md sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-300">
          404
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Page not found
        </h1>

        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-300">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/movies"
            className="rounded-xl bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
          >
            Back to movies
          </Link>

          <Link
            to="/about"
            className="rounded-xl border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
          >
            About page
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;
