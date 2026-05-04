import type { ChangeEvent } from 'react';
import Button from '../ui/Button/Button';
import Input from '../ui/Input/Input';

type Props = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
};

export function SearchBar(props: Props) {
  const { value, onChange, onSearch } = props;

  return (
    <div className="flex items-center gap-2 mb-5">
      <Input value={value} onChange={onChange} placeholder="Enter params..." />

      <Button onClick={onSearch} variant="primary">
        Search
      </Button>
    </div>
  );
}
