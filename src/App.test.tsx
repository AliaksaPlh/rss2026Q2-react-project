import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from './test-utils/render';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { batmanMock } from './test-utils/testData';
import { ThemeProvider } from './Context/ThemeProvider';
import { stubTmdbFetch } from './test-utils/tmdbFetchStub';

describe('App', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders application layout with search and initial content area', async () => {
    stubTmdbFetch({ trending: [batmanMock] });

    render(
      <ThemeProvider>
        <MemoryRouter initialEntries={['/movies?page=1']}>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByPlaceholderText(/search movie/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(await screen.findByText(/batman begins/i)).toBeInTheDocument();
  });
});
