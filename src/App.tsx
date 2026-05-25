import { MovieContainer } from './components/MovieContainer/MovieContainer';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { MovieDetailsPanel } from './components/MovieSearchBarResults/MovieDetailsPanel';
import AboutMePage from './components/AboutMe/AboutMe';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import { useTheme } from './Context/useTheme';
import ToggleThemeButton from './components/ThemeToggle/ThemeToggle';

const App = () => {
  const { theme } = useTheme();

  return (
    <section
      className={`relative min-h-screen overflow-x-hidden transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-slate-950 text-slate-100'
          : 'bg-amber-50 text-slate-950'
      }`}
    >
      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
        <ErrorBoundary>
          <nav
            className={`mb-1 flex items-center gap-4 rounded-2xl border px-4 py-1 text-sm font-semibold shadow-card backdrop-blur-md ${
              theme === 'dark'
                ? 'border-slate-800/80 bg-slate-900/50'
                : 'border-amber-200 bg-white/75'
            }`}
          >
            <Link
              to="/movies"
              className={
                theme === 'dark'
                  ? 'text-slate-200 hover:text-white'
                  : 'text-slate-700 hover:text-slate-950'
              }
            >
              Movies
            </Link>
            <Link
              to="/about"
              className={
                theme === 'dark'
                  ? 'text-slate-200 hover:text-white'
                  : 'text-slate-700 hover:text-slate-950'
              }
            >
              About
            </Link>
            <div className="ml-auto">
              <ToggleThemeButton />
            </div>
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
