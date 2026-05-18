import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchPokemonByName, fetchPokemonsPage } from '../../api/pokemonApi';
import { charmanderMock, pikachuMock } from '../../test-utils/testData';
import { fireEvent, render, screen, waitFor } from '../../test-utils/render';
import PokemonContainer from './MovieContainer';

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

  it('shows loading indicator while pokemon list is loading', async () => {
    let resolveRequest: (value: (typeof pikachuMock)[]) => void;

    mockedFetchPokemonsPage.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      })
    );
    render(<PokemonContainer />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    resolveRequest!([pikachuMock]);
    expect(await screen.findByText(/pikachu/i)).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('loads and displays a pokemon list on initial render', async () => {
    mockedFetchPokemonsPage.mockResolvedValue([pikachuMock, charmanderMock]);

    render(<PokemonContainer />);

    expect(
      await screen.findByRole('heading', { name: /pokémon on this page/i })
    ).toBeInTheDocument();
    expect(screen.getByText('2 found.')).toBeInTheDocument();
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    expect(screen.getByText(/charmander/i)).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: /pagination/i })
    ).toBeInTheDocument();
    expect(mockedFetchPokemonsPage).toHaveBeenCalledWith(1);
  });

  it('updates input value when user types', async () => {
    mockedFetchPokemonsPage.mockResolvedValue([charmanderMock]);
    render(<PokemonContainer />);
    await screen.findByText(/charmander/i);
    const input = screen.getByPlaceholderText(/search pokémon/i);

    fireEvent.change(input, {
      target: { value: 'pikachu' },
    });
    expect(input).toHaveValue('pikachu');
  });

  it('searches by name and displays the matching pokemon', async () => {
    mockedFetchPokemonsPage.mockResolvedValue([charmanderMock]);
    mockedFetchPokemonByName.mockResolvedValue(pikachuMock);

    render(<PokemonContainer />);

    await screen.findByText(/charmander/i);

    fireEvent.change(screen.getByPlaceholderText(/search pokémon/i), {
      target: { value: 'Pikachu' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(
      await screen.findByRole('heading', { name: /pikachu/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/electric/i)).toBeInTheDocument();
    expect(mockedFetchPokemonByName).toHaveBeenCalledWith('pikachu');
  });

  it('shows empty input and loads pokemon list when no saved term exists', async () => {
    mockedFetchPokemonsPage.mockResolvedValue([pikachuMock]);

    render(<PokemonContainer />);

    expect(await screen.findByText(/pikachu/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search pokémon/i)).toHaveValue('');
    expect(mockedFetchPokemonsPage).toHaveBeenCalledWith(1);
    expect(mockedFetchPokemonByName).not.toHaveBeenCalled();
  });

  it('shows an error message when the API request fails', async () => {
    mockedFetchPokemonsPage.mockRejectedValue(
      new Error('Failed to fetch list')
    );

    render(<PokemonContainer />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /failed to fetch list/i
    );
  });

  it('loads the next page when the user clicks Next', async () => {
    mockedFetchPokemonsPage
      .mockResolvedValueOnce([pikachuMock])
      .mockResolvedValueOnce([charmanderMock]);

    render(<PokemonContainer />);

    await screen.findByText(/pikachu/i);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(mockedFetchPokemonsPage).toHaveBeenLastCalledWith(2);
    });
    expect(await screen.findByText(/charmander/i)).toBeInTheDocument();
  });
});
