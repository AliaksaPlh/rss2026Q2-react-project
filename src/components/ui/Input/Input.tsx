import React from 'react';
import type { ChangeEvent } from 'react';
import clsx from 'clsx';

interface InputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  className,
  disabled = false,
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={clsx(
        'w-full rounded-xl border border-slate-700/80 bg-slate-900/80 px-4 py-2.5 text-sm text-slate-100 shadow-inner shadow-black/20 backdrop-blur-sm',
        'placeholder:text-slate-500',
        'transition-colors duration-200',
        'focus:border-rose-500/70 focus:outline-none focus:ring-2 focus:ring-rose-500/30',
        'disabled:cursor-not-allowed disabled:opacity-45',
        className
      )}
    />
  );
};

export default Input;
