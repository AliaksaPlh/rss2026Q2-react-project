import React from 'react';
import type { Pokemon } from '../../types/pokemonTypes';
import Loader from '../Loader/Loader';
import { PokemonDetailCard } from './PokemonDetailCard';
import { PokemonList } from './PokemonList';

type Props = {
  loading: boolean;
  error: string | null;
  currentPokemon: Pokemon | null;
  allPokemons: Pokemon[];
};

const PokemonResults: React.FC<Props> = ({
  loading,
  error,
  currentPokemon,
  allPokemons,
}) => {
  if (loading) {
    return <Loader />;
  }

  if (currentPokemon) {
    return <PokemonDetailCard pokemon={currentPokemon} />;
  }

  if (allPokemons.length > 0) {
    return <PokemonList pokemons={allPokemons} />;
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-rose-500/40 bg-rose-950/30 px-5 py-4 text-center shadow-lg shadow-rose-900/20"
      >
        <p className="text-sm font-semibold text-rose-200">{error}</p>
      </div>
    );
  }

  return null;
};

export default PokemonResults;
