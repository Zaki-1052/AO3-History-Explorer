// src/components/common/Card.tsx
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  footer?: ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  title,
  footer
}) => {
  return (
    <div className={`ao3-card overflow-hidden ${className}`}>
      {title && (
        <div className="p-4 border-b border-ao3-mediumgray dark:border-gray-600">
          {typeof title === 'string' ? (
            <h3 className="text-lg font-medium text-ao3-darkgray dark:text-ao3-lightgray">
              {title}
            </h3>
          ) : (
            title
          )}
        </div>
      )}
      
      <div className="p-4">
        {children}
      </div>
      
      {footer && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-ao3-mediumgray dark:border-gray-600">
          {footer}
        </div>
      )}
    </div>
  );
};