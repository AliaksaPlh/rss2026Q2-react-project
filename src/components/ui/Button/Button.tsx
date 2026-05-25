import React from 'react';
import clsx from 'clsx';

interface ButtonProps {
  variant?: 'primary' | 'success' | 'secondary' | 'outline' | 'ghost';
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
        'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400',
        'disabled:pointer-events-none disabled:opacity-45',
        {
          'bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-lg shadow-rose-900/35 hover:from-rose-500 hover:to-orange-400 hover:shadow-glow active:scale-[0.98]':
            variant === 'primary',
          'bg-emerald-600 text-white shadow-md shadow-emerald-900/30 hover:bg-emerald-500 active:scale-[0.98]':
            variant === 'success',
          'bg-slate-700 text-slate-100 shadow-md hover:bg-slate-600 active:scale-[0.98]':
            variant === 'secondary',
          'border border-slate-600 bg-slate-900/60 text-slate-200 backdrop-blur-sm hover:border-slate-500 hover:bg-slate-800/80 active:scale-[0.98]':
            variant === 'outline',
          'border border-transparent bg-transparent text-slate-400 hover:bg-slate-800/80 hover:text-slate-200':
            variant === 'ghost',
        },
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
