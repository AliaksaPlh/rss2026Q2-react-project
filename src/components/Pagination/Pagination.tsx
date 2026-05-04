import React from 'react';
import Button from '../ui/Button/Button';

interface Props {
  currentPage: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<Props> = ({ currentPage, onPageChange }) => {
  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-3 rounded-2xl  px-4 py-4 shadow-inner shadow-black/20 "
      aria-label="Pagination"
    >
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="min-w-[6.5rem]"
      >
        Previous
      </Button>

      <span className="min-w-[5rem] text-center text-sm font-medium tabular-nums text-slate-300">
        Page <span className="text-white">{currentPage}</span>
      </span>

      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        className="min-w-[6.5rem]"
      >
        Next
      </Button>
    </nav>
  );
};

export default Pagination;
