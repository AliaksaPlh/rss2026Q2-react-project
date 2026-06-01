import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../../test-utils/render';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('calls onChange when user types', () => {
    const onChange = vi.fn();

    render(<SearchBar value="" onChange={onChange} onSearch={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText(/search movie/i), {
      target: { value: 'batman' },
    });

    expect(onChange).toHaveBeenCalled();
  });

  it('calls onSearch when Search button is clicked', () => {
    const onSearch = vi.fn();

    render(
      <SearchBar value="batman" onChange={vi.fn()} onSearch={onSearch} />
    );

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('calls onRefresh when Refresh button is clicked', () => {
    const onRefresh = vi.fn();

    render(
      <SearchBar
        value="batman"
        onChange={vi.fn()}
        onSearch={vi.fn()}
        onRefresh={onRefresh}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /refresh/i }));

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
