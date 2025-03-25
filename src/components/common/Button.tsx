// src/components/common/Button.tsx
import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  className = '',
  ...rest 
}) => {
  const baseClasses = variant === 'primary' 
    ? 'ao3-button-primary' 
    : 'ao3-button-secondary';
  
  const sizeClasses = size === 'sm' 
    ? 'text-sm py-1 px-3' 
    : size === 'lg' 
      ? 'text-lg py-3 px-5' 
      : 'text-base py-2 px-4';
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button 
      className={`${baseClasses} ${sizeClasses} ${widthClass} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};