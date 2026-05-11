import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchPokemonByName, fetchPokemonsPage } from '../../api/pokemonApi';
import {
  charmanderMock,
  pikachuMock,
  squirtleMock,
} from '../../test-utils/testData';
import { fireEvent, render, screen } from '../../test-utils/render';
import PokemonContainer from './PokemonContainer';

vi.mock('../../api/pokemonApi', () => ({
  fetchPokemonByName: vi.fn(),
  fetchPokemonsPage: vi.fn(),
}));

const mockedFetchPokemonByName = vi.mocked(fetchPokemonByName);
const mockedFetchPokemonsPage = vi.mocked(fetchPokemonsPage);

describe('PokemonContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('saves trimmed lowercase search term to localStorage after search', async () => {
    mockedFetchPokemonsPage.mockResolvedValue([charmanderMock]);
    mockedFetchPokemonByName.mockResolvedValue(pikachuMock);

    render(<PokemonContainer />);

    await screen.findByText(/charmander/i);

    fireEvent.change(screen.getByPlaceholderText(/search pokémon/i), {
      target: { value: '  PIKACHU  ' },
    });

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(localStorage.getItem('searchTerm')).toBe('pikachu');
    expect(
      await screen.findByRole('heading', { name: /pikachu/i })
    ).toBeInTheDocument();
    expect(mockedFetchPokemonByName).toHaveBeenCalledWith('pikachu');
  });

  it('loads a saved search term from localStorage', async () => {
    localStorage.setItem('searchTerm', 'squirtle');
    mockedFetchPokemonByName.mockResolvedValue(squirtleMock);

    render(<PokemonContainer />);

    expect(
      await screen.findByRole('heading', { name: /squirtle/i })
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('squirtle')).toBeInTheDocument();
    expect(mockedFetchPokemonByName).toHaveBeenCalledWith('squirtle');
    expect(mockedFetchPokemonsPage).not.toHaveBeenCalled();
  });

  it('does not repeat search when term is already saved in localStorage', async () => {
    localStorage.setItem('searchTerm', 'pikachu');
    mockedFetchPokemonByName.mockResolvedValue(pikachuMock);

    render(<PokemonContainer />);

    await screen.findByRole('heading', { name: /pikachu/i });

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(mockedFetchPokemonByName).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('searchTerm')).toBe('pikachu');
  });

  it('overwrites existing localStorage value when new search is performed', async () => {
    localStorage.setItem('searchTerm', 'charmander');

    mockedFetchPokemonByName
      .mockResolvedValueOnce(charmanderMock)
      .mockResolvedValueOnce(pikachuMock);

    render(<PokemonContainer />);

    expect(
      await screen.findByRole('heading', { name: /charmander/i })
    ).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/search pokémon/i), {
      target: { value: 'pikachu' },
    });

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(localStorage.getItem('searchTerm')).toBe('pikachu');
    expect(mockedFetchPokemonByName).toHaveBeenLastCalledWith('pikachu');
    expect(
      await screen.findByRole('heading', { name: /pikachu/i })
    ).toBeInTheDocument();
  });

  it('does not search when input changes but Search is not clicked', async () => {
    mockedFetchPokemonsPage.mockResolvedValue([charmanderMock]);
    mockedFetchPokemonByName.mockResolvedValue(pikachuMock);

    render(<PokemonContainer />);

    await screen.findByText(/charmander/i);

    fireEvent.change(screen.getByPlaceholderText(/search pokémon/i), {
      target: { value: 'pikachu' },
    });

    expect(screen.getByDisplayValue('pikachu')).toBeInTheDocument();
    expect(mockedFetchPokemonByName).not.toHaveBeenCalled();
    expect(localStorage.getItem('searchTerm')).toBeNull();
    expect(
      screen.queryByRole('heading', { name: /pikachu/i })
    ).not.toBeInTheDocument();
  });
});
