import { MovieContainer } from './components/MovieContainer/MovieContainer';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { MovieDetailsPanel } from './components/MovieSearchBarResults/MovieDetailsPanel';
import AboutMePage from './components/AboutMe/AboutMe';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';

const App = () => {
  return (
    <section className="relative min-h-screen overflow-x-hidden">
      <div
        className="pointer-events-none fixed inset-0 bg-[length:48px_48px] bg-grid-slate opacity-40"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-rose-600/20 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -right-32 bottom-0 h-[24rem] w-[24rem] rounded-full bg-amber-500/15 blur-[90px]"
        aria-hidden
      />

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
        <ErrorBoundary>
          <nav className="mb-6 flex gap-4 text-sm font-semibold">
            <Link to="/movies" className="text-slate-200 hover:text-white">
              Movies
            </Link>
            <Link to="/about" className="text-slate-200 hover:text-white">
              About
            </Link>
          </nav>
          <Routes>
            <Route path="/" element={<Navigate to="/movies" replace />} />
            <Route path="/movies" element={<MovieContainer />}>
              <Route index element={<MovieDetailsPanel />} />
            </Route>{' '}
            <Route path="/about" element={<AboutMePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>{' '}
        </ErrorBoundary>
      </main>
    </section>
  );
};

export default App;
