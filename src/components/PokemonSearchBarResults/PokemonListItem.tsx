import type { Pokemon } from '../../types/pokemonTypes';
import { TypePills } from '../ui/TypePills/TypePills';

type Props = {
  pokemon: Pokemon;
};

export function PokemonListItem({ pokemon }: Props) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-slate-800/90 bg-slate-900/50 p-3 transition-colors hover:border-slate-600/90 hover:bg-slate-800/50">
      <div className="flex h-26 w-26 shrink-0 items-center justify-center rounded-xl bg-slate-950/60 ring-1 ring-white/5">
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="h-24 w-24 object-contain transition-transform group-hover:scale-105"
        />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <strong className="block truncate capitalize text-slate-100">
          {pokemon.name}
        </strong>
        <TypePills types={pokemon.types} align="start" size="sm" />
      </div>
    </div>
  );
}
