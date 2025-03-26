// src/components/DataTable/WorksTable.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Card } from '../common/Card';
//import { Button } from '../common/Button';
import { Icon } from '../common/Icon';
import { useData } from '../../context/DataContext';
import { sortWorks, filterWorks } from '../../utils/dataProcessing';
//import { TableHeader } from './TableHeader';

// Row height for virtualization
const ROW_HEIGHT = 72; 

export const WorksTable: React.FC = () => {
  const { works, sortConfig, setSortConfig, filterOptions, searchTerm } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  
  // Reset to first page when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterOptions, searchTerm]);
  
  // Define table columns
  const columns = [
    { key: 'title', label: 'Title', sortable: true, width: 'w-1/4' },
    { key: 'author', label: 'Author', sortable: true, width: 'w-1/6' },
    { key: 'stats.wordCount', label: 'Words', sortable: true, width: 'w-20' },
    { key: 'userStats.visits', label: 'Visits', sortable: true, width: 'w-16' },
    { key: 'userStats.lastVisited', label: 'Last Visited', sortable: true, width: 'w-32' },
    { key: 'rating', label: 'Rating', sortable: true, width: 'w-24' },
    { key: 'completion', label: 'Status', sortable: true, width: 'w-24' }
  ];

  // Handle sorting
  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  // Helper function to format ratings concisely
  const formatRating = (rating: string): string => {
    if (rating === 'Teen And Up Audiences') return 'Teen+';
    if (rating === 'General Audiences') return 'General';
    if (rating === 'Not Rated') return 'Not Rated';
    return rating; // For Mature, Explicit, or any other rating
  };

  // Filter and sort works
  const filteredAndSortedWorks = useMemo(() => {
    return sortWorks(filterWorks(works, searchTerm, filterOptions), sortConfig);
  }, [works, searchTerm, filterOptions, sortConfig]);
  
  // Pagination
  const totalPages = Math.ceil(filteredAndSortedWorks.length / rowsPerPage);
  const paginatedWorks = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredAndSortedWorks.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedWorks, currentPage, rowsPerPage]);
  
  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pageNumbers = [];
    const maxPageButtons = 5; // Maximum number of page buttons to show
    
    // Calculate which page buttons to show
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxPageButtons && startPage > 1) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="flex items-center space-x-1">
        {/* First Page Button */}
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className={`p-1.5 rounded ${
            currentPage === 1
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          aria-label="First page"
        >
          <Icon icon="chevron-double-left" size="sm" />
        </button>
        
        {/* Previous Page Button */}
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-1.5 rounded ${
            currentPage === 1
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          aria-label="Previous page"
        >
          <Icon icon="chevron-left" size="sm" />
        </button>
        
        {/* Page Number Buttons */}
        {pageNumbers.map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1.5 rounded text-sm font-medium ${
              currentPage === page
                ? 'bg-ao3-red text-white dark:bg-ao3-darkred'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
        
        {/* Next Page Button */}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-1.5 rounded ${
            currentPage === totalPages
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          aria-label="Next page"
        >
          <Icon icon="chevron-right" size="sm" />
        </button>
        
        {/* Last Page Button */}
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className={`p-1.5 rounded ${
            currentPage === totalPages
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          aria-label="Last page"
        >
          <Icon icon="chevron-double-right" size="sm" />
        </button>
      </div>
    );
  };
  
  // Table row renderer for virtualization
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const work = paginatedWorks[index];
    if (!work) return null;
    
    return (
      <div style={style} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
        <div className="grid grid-cols-7 h-full">
          {/* Title + Fandom */}
          <div className="px-4 py-3 col-span-1">
            <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
              {work.title}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
              {work.fandoms.map(f => f.name).join(', ')}
            </div>
          </div>

          {/* Author */}
          <div className="px-4 py-3 col-span-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {work.author}
            </div>
          </div>

          {/* Word Count */}
          <div className="px-4 py-3 col-span-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {work.stats.wordCount.toLocaleString()}
            </div>
          </div>

          {/* Visits */}
          <div className="px-4 py-3 col-span-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {work.userStats.visits}
            </div>
          </div>

          {/* Last Visited */}
          <div className="px-4 py-3 col-span-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {work.userStats.lastVisited}
            </div>
          </div>

          {/* Rating */}
          <div className="px-4 py-3 col-span-1">
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
              ${work.rating.includes('Explicit') 
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                : work.rating.includes('Mature') 
                  ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' 
                  : work.rating.includes('Teen') 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
              {formatRating(work.rating)}
            </span>
          </div>

          {/* Status */}
          <div className="px-4 py-3 col-span-1">
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
              ${work.completion.includes('Complete') 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}>
              {work.completion.includes('Complete') ? 'Complete' : 'WIP'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Calculate table height for virtualization
  const tableHeight = Math.min(
    paginatedWorks.length * ROW_HEIGHT, 
    // Max height: 10 rows or fewer if there are fewer works
    Math.max(ROW_HEIGHT, Math.min(10 * ROW_HEIGHT, paginatedWorks.length * ROW_HEIGHT))
  );

  return (
    <Card
      title="Your Reading History"
      footer={
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {paginatedWorks.length} of {filteredAndSortedWorks.length} works
            {filteredAndSortedWorks.length !== works.length && (
              <span> (filtered from {works.length} total)</span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center justify-end gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Rows per page:
              </span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page
                }}
                className="text-sm border-gray-300 dark:border-gray-600 rounded-md 
                          bg-white dark:bg-gray-700 text-ao3-darkgray dark:text-white"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline-block">
                  Page {currentPage} of {totalPages}
                </span>
                
                {renderPagination()}
              </div>
            )}
          </div>
        </div>
      }
    >
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-7">
                {columns.map((column) => (
                  <div
                    key={column.key}
                    onClick={() => column.sortable ? handleSort(column.key) : undefined}
                    className={`
                      px-4 py-3 text-left text-xs font-medium uppercase tracking-wider
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
                  </div>
                ))}
              </div>
            </div>
            
            {paginatedWorks.length > 0 ? (
              <div style={{ height: tableHeight }}>
                <List
                  height={tableHeight}
                  itemCount={paginatedWorks.length}
                  itemSize={ROW_HEIGHT}
                  width="100%"
                >
                  {Row}
                </List>
              </div>
            ) : (
              <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                {filteredAndSortedWorks.length === 0 ? 'No matching works found' : 'Loading works...'}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};