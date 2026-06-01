import type { ChangeEvent } from 'react';
import Button from '../ui/Button/Button';
import Input from '../ui/Input/Input';

type Props = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
};

export function SearchBar(props: Props) {
  const { value, onChange, onSearch, onRefresh, refreshing = false } = props;

  return (
    <div className="w-full max-w-2xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="min-w-0 flex-1">
          <Input
            value={value}
            onChange={onChange}
            placeholder="Search movie by title, or leave empty for trending movies..."
          />
        </div>
        <Button
          type="button"
          onClick={onSearch}
          variant="primary"
          className="shrink-0 sm:min-w-[7.5rem]"
        >
          Search
        </Button>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline" disabled={refreshing}>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        )}
      </div>
      <p className="mt-2 text-left text-xs text-slate-500">
        Clear the field and search again.
      </p>
    </div>
  );
}
