import { Component } from 'react';
import type { ChangeEvent } from 'react';
import { fetchPokemonByName, fetchPokemonsPage } from '../../api/pokemonApi';
import { SearchBar } from '../SearchBar/SearchBar';
import PokemonResults from '../PokemonSearchBarResults/PokemonResults';
import type { Pokemon } from '../../types/pokemonTypes';
import ErrorBoundaryButton from '../ErrorBoundary/ErrorBoundaryButton';
import Pagination from '../Pagination/Pagination';

type State = {
  term: string;
  loading: boolean;
  error: string | null;
  currentPokemon: Pokemon | null;
  allPokemons: Pokemon[];
  currentPage: number;
};

export class PokemonContainer extends Component<Record<string, never>, State> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      term: '',
      loading: false,
      error: null,
      currentPokemon: null,
      allPokemons: [],
      currentPage: 1,
    };
  }

  beginFetchReset = (nextPage?: number) => {
    const base = {
      loading: true,
      error: null,
      currentPokemon: null,
      allPokemons: [] as Pokemon[],
    };
    if (nextPage !== undefined) {
      this.setState({ ...base, currentPage: nextPage });
    } else {
      this.setState(base);
    }
  };

  failFetch = (error: unknown) => {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';
    this.setState({ error: message, loading: false });
  };

  componentDidMount() {
    const savedTerm = localStorage.getItem('searchTerm') || '';
    this.setState({ term: savedTerm }, () => {
      if (savedTerm.trim()) {
        this.loadPokemonByName(savedTerm.trim());
      } else {
        this.loadPokemonList();
      }
    });
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ term: e.target.value });
  };

  handleSearch = () => {
    const trimmed = this.state.term.trim().toLowerCase();
    const persisted = localStorage.getItem('searchTerm') ?? '';
    if (trimmed === persisted) {
      return;
    }
    localStorage.setItem('searchTerm', trimmed);

    if (trimmed === '') {
      this.loadPokemonList();
    } else {
      this.loadPokemonByName(trimmed);
    }
  };

  handlePageChange = (newPage: number) => {
    this.loadPokemonList(newPage);
  };

  loadPokemonByName = async (name: string) => {
    this.beginFetchReset();

    try {
      const data = await fetchPokemonByName(name);
      this.setState({ currentPokemon: data, loading: false });
    } catch (error: unknown) {
      this.failFetch(error);
    }
  };

  loadPokemonList = async (page: number = 1) => {
    this.beginFetchReset(page);

    try {
      const pokemons = await fetchPokemonsPage(page);
      this.setState({ allPokemons: pokemons, loading: false });
    } catch (error: unknown) {
      this.failFetch(error);
    }
  };

  render() {
    const { term, loading, error, currentPokemon, allPokemons } = this.state;

    return (
      <div className="flex w-full flex-col items-stretch gap-10">
        <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 shadow-card backdrop-blur-md sm:p-6">
          <SearchBar
            value={term}
            onChange={this.handleChange}
            onSearch={this.handleSearch}
          />
        </section>

        <PokemonResults
          loading={loading}
          error={error}
          currentPokemon={currentPokemon}
          allPokemons={allPokemons}
        />

        {!currentPokemon && allPokemons.length > 0 && (
          <Pagination
            currentPage={this.state.currentPage}
            onPageChange={this.handlePageChange}
          />
        )}

        <div className="flex justify-center border-t border-slate-800/80 pt-8">
          <ErrorBoundaryButton />
        </div>
      </div>
    );
  }
}

export default PokemonContainer;
