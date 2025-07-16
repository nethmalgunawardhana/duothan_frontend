import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
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
    primary: 'bg-oasis-primary text-oasis-dark border-oasis-primary hover:bg-transparent hover:text-oasis-primary hover:shadow-lg hover:shadow-oasis-primary/50',
    secondary: 'bg-oasis-secondary text-white border-oasis-secondary hover:bg-transparent hover:text-oasis-secondary hover:shadow-lg hover:shadow-oasis-secondary/50',
    danger: 'bg-oasis-error text-white border-oasis-error hover:bg-transparent hover:text-oasis-error hover:shadow-lg hover:shadow-oasis-error/50',
    ghost: 'bg-transparent text-oasis-primary border-oasis-primary hover:bg-oasis-primary hover:text-oasis-dark hover:shadow-lg hover:shadow-oasis-primary/50'
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
