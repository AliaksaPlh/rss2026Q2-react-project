import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../../test-utils/render';
import Pagination from './Pagination';

describe('Pagination', () => {
  it('disables Previous on the first page', () => {
    render(<Pagination currentPage={1} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
  });

  it('calls onPageChange with next page when Next is clicked', () => {
    const onPageChange = vi.fn();

    render(<Pagination currentPage={2} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange with previous page when Previous is clicked', () => {
    const onPageChange = vi.fn();

    render(<Pagination currentPage={2} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole('button', { name: /previous/i }));

    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});
