export function TypePills({
  types,
  align = 'center',
  size = 'default',
}: {
  types: { type: { name: string } }[];
  align?: 'center' | 'start';
  size?: 'default' | 'sm';
}) {
  const row =
    align === 'center'
      ? 'mt-1 flex flex-wrap justify-center gap-2'
      : 'mt-0.5 flex flex-wrap justify-start gap-1.5';
  const pill =
    size === 'sm'
      ? 'rounded-md bg-slate-800/90 px-2 py-0.5 text-[10px] font-medium capitalize text-slate-300 ring-1 ring-white/5'
      : 'rounded-full bg-slate-800 px-3 py-1 text-xs font-medium capitalize text-rose-200 ring-1 ring-white/10';

  return (
    <div className={row}>
      {types.map((t) => (
        <span key={t.type.name} className={pill}>
          {t.type.name}
        </span>
      ))}
    </div>
  );
}
