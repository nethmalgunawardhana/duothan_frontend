import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border-2';
  
  const variants = {

    primary: 'bg-oasis-primary text-oasis-dark hover:bg-oasis-primary/90 focus-visible:ring-oasis-primary',
    secondary: 'bg-oasis-secondary text-white hover:bg-oasis-secondary/90 focus-visible:ring-oasis-secondary',
    outline: 'border border-oasis-primary text-oasis-primary hover:bg-oasis-primary hover:text-oasis-dark focus-visible:ring-oasis-primary',
    ghost: 'text-oasis-primary hover:bg-oasis-primary/10 focus-visible:ring-oasis-primary',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',

  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const isDisabled = disabled || loading;
  
  return (
    <button
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  );
};
