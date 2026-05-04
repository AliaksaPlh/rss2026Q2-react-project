import React from 'react';
import clsx from 'clsx';

interface ButtonProps {
  variant?: 'primary' | 'success' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  type = 'button',
  onClick,
  children,
  disabled = false,
  className,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-green-600 text-white hover:bg-green-700': variant === 'success',
          'bg-gray-500 text-white hover:bg-gray-600': variant === 'secondary',
        },
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
