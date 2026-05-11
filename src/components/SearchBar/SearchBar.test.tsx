import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../../test-utils/render';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('calls onChange when user types', () => {
    const onChange = vi.fn();

    render(<SearchBar value="" onChange={onChange} onSearch={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText(/search pokémon/i), {
      target: { value: 'pikachu' },
    });

    expect(onChange).toHaveBeenCalled();
  });

  it('calls onSearch when Search button is clicked', () => {
    const onSearch = vi.fn();

    render(
      <SearchBar value="pikachu" onChange={vi.fn()} onSearch={onSearch} />
    );

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(onSearch).toHaveBeenCalledTimes(1);
  });
});
