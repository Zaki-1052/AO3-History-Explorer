// src/components/DataTable/TableHeader.tsx
import React from 'react';
import { Icon } from '../common/Icon';
import { SortConfig } from '../../types/AO3Types';

interface Column {
  key: string;
  label: string;
  sortable: boolean;
  width?: string;
  span?: number; // Added span property
}

interface TableHeaderProps {
  columns: Column[];
  sortConfig: SortConfig;
  onSort: (key: string) => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ columns, sortConfig, onSort }) => {
  return (
    <thead className="bg-gray-50 dark:bg-gray-700">
      <tr className="grid grid-cols-10">
        {columns.map((column) => (
          <th
            key={column.key}
            onClick={() => column.sortable ? onSort(column.key) : undefined}
            className={`
              px-4 py-3 text-left text-xs font-medium uppercase tracking-wider
              ${column.span ? `col-span-${column.span}` : ''}
              ${column.width || ''}
              ${column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''}
              ${sortConfig.key === column.key 
                ? 'text-ao3-red dark:text-white bg-gray-100 dark:bg-gray-600' 
                : 'text-gray-500 dark:text-gray-300'}
            `}
          >
            <div className="flex items-center space-x-1">
              <span>{column.label}</span>
              {sortConfig.key === column.key && (
                <Icon 
                  icon={sortConfig.direction === 'asc' ? 'sort-asc' : 'sort-desc'} 
                  size="sm"
                />
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};