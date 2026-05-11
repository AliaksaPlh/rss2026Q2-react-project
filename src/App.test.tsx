import { describe, expect, it, vi } from 'vitest';
import { render, screen } from './test-utils/render';
import App from './App';
import { fetchPokemonsPage } from './api/pokemonApi';
import { pikachuMock } from './test-utils/testData';

vi.mock('./api/pokemonApi', () => ({
  fetchPokemonByName: vi.fn(),
  fetchPokemonsPage: vi.fn(),
}));

describe('App', () => {
  it('renders application layout with search and initial content area', async () => {
    vi.mocked(fetchPokemonsPage).mockResolvedValue([pikachuMock]);

    render(<App />);

    expect(screen.getByPlaceholderText(/search pokémon/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(await screen.findByText(/pikachu/i)).toBeInTheDocument();
  });
});
