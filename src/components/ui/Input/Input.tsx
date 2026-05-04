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
        'w-full px-3 py-2 border border-gray-300 rounded-lg',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        'transition-colors duration-200',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        className
      )}
    />
  );
};

export default Input;
