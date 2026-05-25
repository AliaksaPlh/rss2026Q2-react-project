import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { searchMoviesByTitle } from '../../api/movieApi';
import { batmanMock, supermanMock } from '../../test-utils/testData';
import { fireEvent, render, screen, waitFor } from '../../test-utils/render';
import MovieContainer from './MovieContainer';

vi.mock('../../api/movieApi', () => ({
  searchMoviesByTitle: vi.fn(),
  fetchMovieById: vi.fn(),
}));

const mockedSearchMoviesByTitle = vi.mocked(searchMoviesByTitle);

function renderMovieContainer(initialEntry = '/movies?page=1') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <MovieContainer />
    </MemoryRouter>
  );
}

describe('MovieContainer', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('shows loading indicator while movies are loading', async () => {
    let resolveRequest: (value: typeof batmanMock[]) => void;

    mockedSearchMoviesByTitle.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      })
    );
    renderMovieContainer();

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    resolveRequest!([batmanMock]);

    expect(await screen.findByText(/batman begins/i)).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('loads and displays a movie list on initial render', async () => {
    mockedSearchMoviesByTitle.mockResolvedValue([batmanMock, supermanMock]);

    renderMovieContainer();

    expect(
      await screen.findByRole('heading', { name: /movies/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Batman Begins')).toBeInTheDocument();
    expect(screen.getByText('Superman')).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: /pagination/i })
    ).toBeInTheDocument();
    expect(mockedSearchMoviesByTitle).toHaveBeenCalledWith('', 1);
  });

  it('updates input value when user types', async () => {
    mockedSearchMoviesByTitle.mockResolvedValue([supermanMock]);
    renderMovieContainer();

    await screen.findByText('Superman');
    const input = screen.getByPlaceholderText(/search movie/i);

    fireEvent.change(input, {
      target: { value: 'batman' },
    });

    expect(input).toHaveValue('batman');
  });

  it('searches by title and displays matching movies', async () => {
    mockedSearchMoviesByTitle
      .mockResolvedValueOnce([supermanMock])
      .mockResolvedValueOnce([batmanMock]);

    renderMovieContainer();

    await screen.findByText('Superman');

    fireEvent.change(screen.getByPlaceholderText(/search movie/i), {
      target: { value: 'Batman' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(await screen.findByText('Batman Begins')).toBeInTheDocument();
    expect(mockedSearchMoviesByTitle).toHaveBeenLastCalledWith('batman', 1);
  });

  it('shows empty input and loads trending movies when no saved term exists', async () => {
    mockedSearchMoviesByTitle.mockResolvedValue([batmanMock]);

    renderMovieContainer();

    expect(await screen.findByText('Batman Begins')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search movie/i)).toHaveValue('');
    expect(mockedSearchMoviesByTitle).toHaveBeenCalledWith('', 1);
  });

  it('shows an error message when the API request fails', async () => {
    mockedSearchMoviesByTitle.mockRejectedValue(
      new Error('Failed to fetch movies')
    );

    renderMovieContainer();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /failed to fetch movies/i
    );
  });

  it('loads the next page when the user clicks Next', async () => {
    mockedSearchMoviesByTitle
      .mockResolvedValueOnce([batmanMock])
      .mockResolvedValueOnce([supermanMock]);

    renderMovieContainer();

    await screen.findByText('Batman Begins');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(mockedSearchMoviesByTitle).toHaveBeenLastCalledWith('', 2);
    });
    expect(await screen.findByText('Superman')).toBeInTheDocument();
  });
});
