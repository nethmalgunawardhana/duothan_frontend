import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-oasis-primary mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-oasis-primary">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3 bg-oasis-surface border-2 border-oasis-primary/30 rounded-lg
            text-white placeholder-gray-400
            focus:outline-none focus:border-oasis-primary focus:ring-2 focus:ring-oasis-primary/20
            transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-oasis-error focus:border-oasis-error focus:ring-oasis-error/20' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-oasis-error">{error}</p>
      )}
    </div>
  );
};