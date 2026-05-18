import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { searchMoviesByTitle } from '../../api/movieApi';
import { batmanMock, duneMock, supermanMock } from '../../test-utils/testData';
import { fireEvent, render, screen } from '../../test-utils/render';
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

describe('MovieContainer localStorage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('saves trimmed lowercase search term to localStorage after search', async () => {
    mockedSearchMoviesByTitle
      .mockResolvedValueOnce([supermanMock])
      .mockResolvedValueOnce([batmanMock]);

    renderMovieContainer();

    await screen.findByText('Superman');

    fireEvent.change(screen.getByPlaceholderText(/search movie/i), {
      target: { value: '  BATMAN  ' },
    });

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(localStorage.getItem('searchTerm')).toBe('batman');
    expect(await screen.findByText('Batman Begins')).toBeInTheDocument();
    expect(mockedSearchMoviesByTitle).toHaveBeenLastCalledWith('batman', 1);
  });

  it('loads a saved search term from localStorage', async () => {
    localStorage.setItem('searchTerm', 'dune');
    mockedSearchMoviesByTitle.mockResolvedValue([duneMock]);

    renderMovieContainer();

    expect(await screen.findByText('Dune')).toBeInTheDocument();
    expect(screen.getByDisplayValue('dune')).toBeInTheDocument();
    expect(mockedSearchMoviesByTitle).toHaveBeenCalledWith('dune', 1);
  });

  it('does not repeat search when term is already saved in localStorage', async () => {
    localStorage.setItem('searchTerm', 'batman');
    mockedSearchMoviesByTitle.mockResolvedValue([batmanMock]);

    renderMovieContainer();

    await screen.findByText('Batman Begins');

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(mockedSearchMoviesByTitle).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('searchTerm')).toBe('batman');
  });

  it('overwrites existing localStorage value when new search is performed', async () => {
    localStorage.setItem('searchTerm', 'superman');

    mockedSearchMoviesByTitle
      .mockResolvedValueOnce([supermanMock])
      .mockResolvedValueOnce([batmanMock]);

    renderMovieContainer();

    expect(await screen.findByText('Superman')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/search movie/i), {
      target: { value: 'batman' },
    });

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(localStorage.getItem('searchTerm')).toBe('batman');
    expect(mockedSearchMoviesByTitle).toHaveBeenLastCalledWith('batman', 1);
    expect(await screen.findByText('Batman Begins')).toBeInTheDocument();
  });

  it('does not search when input changes but Search is not clicked', async () => {
    mockedSearchMoviesByTitle.mockResolvedValue([supermanMock]);

    renderMovieContainer();

    await screen.findByText('Superman');

    fireEvent.change(screen.getByPlaceholderText(/search movie/i), {
      target: { value: 'batman' },
    });

    expect(screen.getByDisplayValue('batman')).toBeInTheDocument();
    expect(mockedSearchMoviesByTitle).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('searchTerm')).toBeNull();
    expect(
      screen.queryByText('Batman Begins')
    ).not.toBeInTheDocument();
  });
});
