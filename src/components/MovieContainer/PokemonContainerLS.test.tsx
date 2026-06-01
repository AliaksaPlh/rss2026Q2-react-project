import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { batmanMock, duneMock, supermanMock } from '../../test-utils/testData';
import { stubTmdbFetch } from '../../test-utils/tmdbFetchStub';
import { fireEvent, render, screen } from '../../test-utils/render';
import MovieContainer from './MovieContainer';

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

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('saves trimmed lowercase search term to localStorage after search', async () => {
    stubTmdbFetch({
      trending: [supermanMock],
      search: [batmanMock],
    });

    renderMovieContainer();

    await screen.findByText('Superman');

    fireEvent.change(screen.getByPlaceholderText(/search movie/i), {
      target: { value: '  BATMAN  ' },
    });

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(localStorage.getItem('searchTerm')).toBe('batman');
    expect(await screen.findByText('Batman Begins')).toBeInTheDocument();
  });

  it('loads a saved search term from localStorage', async () => {
    localStorage.setItem('searchTerm', 'dune');
    stubTmdbFetch({ search: [duneMock] });

    renderMovieContainer();

    expect(await screen.findByText('Dune')).toBeInTheDocument();
    expect(screen.getByDisplayValue('dune')).toBeInTheDocument();
  });

  it('does not repeat search when term is already saved in localStorage', async () => {
    localStorage.setItem('searchTerm', 'batman');
    const fetchMock = stubTmdbFetch({ search: [batmanMock] });

    renderMovieContainer();

    await screen.findByText('Batman Begins');

    const callsAfterLoad = fetchMock.mock.calls.length;

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(fetchMock.mock.calls.length).toBe(callsAfterLoad);
    expect(localStorage.getItem('searchTerm')).toBe('batman');
  });

  it('overwrites existing localStorage value when new search is performed', async () => {
    localStorage.setItem('searchTerm', 'superman');

    stubTmdbFetch({
      searchByQuery: {
        superman: [supermanMock],
        batman: [batmanMock],
      },
    });

    renderMovieContainer();

    expect(await screen.findByText('Superman')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/search movie/i), {
      target: { value: 'batman' },
    });

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(localStorage.getItem('searchTerm')).toBe('batman');
    expect(await screen.findByText('Batman Begins')).toBeInTheDocument();
  });

  it('does not search when input changes but Search is not clicked', async () => {
    const fetchMock = stubTmdbFetch({ trending: [supermanMock] });

    renderMovieContainer();

    await screen.findByText('Superman');

    const callsAfterLoad = fetchMock.mock.calls.length;

    fireEvent.change(screen.getByPlaceholderText(/search movie/i), {
      target: { value: 'batman' },
    });

    expect(screen.getByDisplayValue('batman')).toBeInTheDocument();
    expect(fetchMock.mock.calls.length).toBe(callsAfterLoad);
    expect(localStorage.getItem('searchTerm')).toBeNull();
    expect(screen.queryByText('Batman Begins')).not.toBeInTheDocument();
  });
});
