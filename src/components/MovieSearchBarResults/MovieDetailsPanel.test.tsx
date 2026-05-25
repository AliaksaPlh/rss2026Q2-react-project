import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { MovieDetailsPanel } from './MovieDetailsPanel';
import { fetchMovieById } from '../../api/movieApi';
import { batmanMock } from '../../test-utils/testData';

vi.mock('../../api/movieApi', () => ({
  fetchMovieById: vi.fn(),
}));

const mockedFetchMovieById = vi.mocked(fetchMovieById);

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{location.search}</div>;
}

function renderMovieDetailsPanel(initialEntry = '/movies?page=2&details=1') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/movies"
          element={
            <>
              <MovieDetailsPanel />
              <LocationProbe />
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('MovieDetailsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when details query parameter is missing', () => {
    renderMovieDetailsPanel('/movies?page=2');

    expect(
      screen.queryByRole('button', { name: /close/i })
    ).not.toBeInTheDocument();
    expect(mockedFetchMovieById).not.toHaveBeenCalled();
  });

  it('shows loader while movie details are loading', async () => {
    let resolveRequest: (value: typeof batmanMock) => void;

    mockedFetchMovieById.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      })
    );

    renderMovieDetailsPanel();

    expect(screen.getByRole('status')).toBeInTheDocument();

    resolveRequest!(batmanMock);

    expect(await screen.findByText(/batman begins/i)).toBeInTheDocument();
  });

  it('fetches and renders movie details by id from URL', async () => {
    mockedFetchMovieById.mockResolvedValue(batmanMock);

    renderMovieDetailsPanel('/movies?page=2&details=123');

    expect(mockedFetchMovieById).toHaveBeenCalledWith('123');

    expect(
      await screen.findByRole('heading', { name: /batman begins/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/bruce wayne becomes batman/i)).toBeInTheDocument();
    expect(screen.getByText('2005-06-15')).toBeInTheDocument();
    expect(screen.getByText('8.2')).toBeInTheDocument();
  });

  it('renders an error message when details request fails', async () => {
    mockedFetchMovieById.mockRejectedValue(new Error('Movie details failed'));

    renderMovieDetailsPanel();

    expect(
      await screen.findByText(/movie details failed/i)
    ).toBeInTheDocument();
  });

  it('closes details panel by removing details query parameter', async () => {
    mockedFetchMovieById.mockResolvedValue(batmanMock);

    renderMovieDetailsPanel('/movies?page=2&details=123');

    expect(await screen.findByText(/batman begins/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('?page=2');
    });
  });
});
