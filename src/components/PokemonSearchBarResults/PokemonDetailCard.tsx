import type { Pokemon } from '../../types/pokemonTypes';
import { TypePills } from '../ui/TypePills/TypePills';

type Props = {
  pokemon: Pokemon;
};

export function PokemonDetailCard({ pokemon }: Props) {
  return (
    <article className="mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-3xl border border-slate-700/80 bg-gradient-to-b from-slate-800/90 to-slate-900/95 p-6 shadow-card ring-1 ring-white/5 sm:p-8">
        <div className="relative mx-auto mb-6 flex aspect-square max-h-48 items-center justify-center rounded-2xl bg-slate-950/50 ring-1 ring-inset ring-white/5">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,63,94,0.12),transparent_55%)]"
            aria-hidden
          />
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="relative z-10 h-40 w-40 object-contain drop-shadow-2xl"
          />
        </div>
        <h2 className="mb-1 text-center text-2xl font-bold capitalize tracking-tight text-white">
          {pokemon.name}
        </h2>
        <TypePills types={pokemon.types} />
        <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-slate-950/40 px-3 py-2 ring-1 ring-white/5">
            <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Height
            </dt>
            <dd className="font-semibold text-slate-100">{pokemon.height / 10} m</dd>
          </div>
          <div className="rounded-xl bg-slate-950/40 px-3 py-2 ring-1 ring-white/5">
            <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Weight
            </dt>
            <dd className="font-semibold text-slate-100">{pokemon.weight / 10} kg</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
