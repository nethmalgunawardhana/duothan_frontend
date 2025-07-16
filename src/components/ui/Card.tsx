import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glowing?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  glowing = false 
}) => {
  return (
    <div
      className={`
        bg-oasis-surface border border-oasis-primary/30 rounded-lg p-6
        ${glowing ? 'shadow-lg shadow-oasis-primary/20 animate-glow' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};