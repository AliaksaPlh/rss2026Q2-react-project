import { describe, expect, it, vi } from 'vitest';
import { render, screen } from './test-utils/render';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { searchMoviesByTitle } from './api/movieApi';
import { batmanMock } from './test-utils/testData';

vi.mock('./api/movieApi', () => ({
  searchMoviesByTitle: vi.fn(),
  fetchMovieById: vi.fn(),
}));

describe('App', () => {
  it('renders application layout with search and initial content area', async () => {
    vi.mocked(searchMoviesByTitle).mockResolvedValue([batmanMock]);

    render(
      <MemoryRouter initialEntries={['/movies?page=1']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/search movie/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(await screen.findByText(/batman begins/i)).toBeInTheDocument();
  });
});
