import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { createFetchResponse, createDeferredFetchResponse } from '../../test-utils/apiMocks';
import { moviesListJson, requestUrl, stubTmdbFetch } from '../../test-utils/tmdbFetchStub';
import { batmanMock, supermanMock } from '../../test-utils/testData';
import { fireEvent, render, screen, waitFor } from '../../test-utils/render';
import MovieContainer from './MovieContainer';

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

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows loading indicator while movies are loading', async () => {
    let resolveJson: (value: unknown) => void;
    const jsonPromise = new Promise<unknown>((resolve) => {
      resolveJson = resolve;
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(createDeferredFetchResponse(jsonPromise))
    );

    renderMovieContainer();

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    resolveJson!(moviesListJson([batmanMock]));

    expect(await screen.findByText(/batman begins/i)).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('loads and displays a movie list on initial render', async () => {
    stubTmdbFetch({ trending: [batmanMock, supermanMock] });

    renderMovieContainer();

    expect(
      await screen.findByRole('heading', { name: /movies/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Batman Begins')).toBeInTheDocument();
    expect(screen.getByText('Superman')).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: /pagination/i })
    ).toBeInTheDocument();
  });

  it('reuses cached movie list data between navigations', async () => {
    const fetchMock = stubTmdbFetch({ trending: [batmanMock] });
    const firstRender = renderMovieContainer();

    expect(await screen.findByText('Batman Begins')).toBeInTheDocument();
    const callsAfterFirstLoad = fetchMock.mock.calls.length;

    firstRender.unmount();
    renderMovieContainer();

    expect(await screen.findByText('Batman Begins')).toBeInTheDocument();
    expect(fetchMock.mock.calls.length).toBe(callsAfterFirstLoad);
  });

  it('refreshes movie list data when Refresh is clicked', async () => {
    const fetchMock = stubTmdbFetch({ trending: [batmanMock] });

    renderMovieContainer();

    expect(await screen.findByText('Batman Begins')).toBeInTheDocument();
    const callsAfterFirstLoad = fetchMock.mock.calls.length;

    fireEvent.click(screen.getByRole('button', { name: /refresh/i }));

    await waitFor(() => {
      expect(fetchMock.mock.calls.length).toBeGreaterThan(callsAfterFirstLoad);
    });
  });

  it('updates input value when user types', async () => {
    stubTmdbFetch({ trending: [supermanMock] });
    renderMovieContainer();

    await screen.findByText('Superman');
    const input = screen.getByPlaceholderText(/search movie/i);

    fireEvent.change(input, {
      target: { value: 'batman' },
    });

    expect(input).toHaveValue('batman');
  });

  it('searches by title and displays matching movies', async () => {
    stubTmdbFetch({
      trending: [supermanMock],
      search: [batmanMock],
    });

    renderMovieContainer();

    await screen.findByText('Superman');

    fireEvent.change(screen.getByPlaceholderText(/search movie/i), {
      target: { value: 'Batman' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(await screen.findByText('Batman Begins')).toBeInTheDocument();
  });

  it('shows empty input and loads trending movies when no saved term exists', async () => {
    stubTmdbFetch({ trending: [batmanMock] });

    renderMovieContainer();

    expect(await screen.findByText('Batman Begins')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search movie/i)).toHaveValue('');
  });

  it('shows an error message when the API request fails', async () => {
    stubTmdbFetch({
      reject: new Error('Failed to fetch movies'),
    });

    renderMovieContainer();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /failed to fetch movies/i
    );
  });

  it('loads the next page when the user clicks Next', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = requestUrl(input);
      if (url.includes('/trending/movie')) {
        const match = url.match(/page=(\d+)/);
        const page = match ? Number(match[1]) : 1;
        const movies = page === 1 ? [batmanMock] : [supermanMock];
        return createFetchResponse({ jsonData: moviesListJson(movies) });
      }
      return createFetchResponse({ ok: false, status: 404 });
    });
    vi.stubGlobal('fetch', fetchMock);

    renderMovieContainer();

    await screen.findByText('Batman Begins');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(await screen.findByText('Superman')).toBeInTheDocument();
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
      const trendingCalls = fetchMock.mock.calls.filter((c) =>
        requestUrl(c[0] as RequestInfo | URL).includes('/trending/movie')
      );
      expect(trendingCalls.some((c) => requestUrl(c[0] as RequestInfo | URL).includes('page=2'))).toBe(
        true
      );
    });
  });
});
