// src/components/Layout/Header.tsx
import React from 'react';
import { Container } from '../common/Container';
import { ThemeToggle } from '../common/ThemeToggle';
import { useData } from '../../context/DataContext';

export const Header: React.FC = () => {
  const { works } = useData();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-ao3-mediumgray dark:border-gray-700 py-4">
      <Container>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-ao3-red dark:text-white">
              AO3 History Explorer
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
              Explore and analyze your Archive of Our Own reading history
            </p>
            {works.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {works.length.toLocaleString()} works loaded
              </p>
            )}
          </div>
          
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
};