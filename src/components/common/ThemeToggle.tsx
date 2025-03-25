// src/components/common/ThemeToggle.tsx
import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Icon } from './Icon';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-md bg-white dark:bg-gray-700 text-ao3-darkgray dark:text-ao3-lightgray 
                 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Icon icon={theme === 'light' ? 'moon' : 'sun'} />
    </button>
  );
};