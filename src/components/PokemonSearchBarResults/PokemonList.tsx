import type { Pokemon } from '../../types/pokemonTypes';
import { PokemonListItem } from './PokemonListItem';

type Props = {
  pokemons: Pokemon[];
};

export function PokemonList({ pokemons }: Props) {
  return (
    <section className="w-full">
      <div className="mb-5 flex flex-col gap-1 text-left sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white sm:text-xl">
            Pokémon on this page
          </h3>
          <p className="text-sm text-slate-500">{pokemons.length} found.</p>
        </div>
      </div>
      <ul className="grid max-h-[min(28rem,55vh)] gap-3 overflow-y-auto pr-1 sm:grid-cols-3">
        {pokemons.map((p) => (
          <li key={p.name}>
            <PokemonListItem pokemon={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
