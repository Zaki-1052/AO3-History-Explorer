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
  
  // Define table columns with updated column spans
  /*
  const columns = [
    { key: 'title', label: 'Title', sortable: true, span: 3 },
    { key: 'author', label: 'Author', sortable: true, span: 2 },
    { key: 'stats.wordCount', label: 'Words', sortable: true, span: 1 },
    { key: 'userStats.visits', label: 'Visits', sortable: true, span: 1 },
    { key: 'userStats.lastVisited', label: 'Last Visited', sortable: true, span: 1 },
    { key: 'rating', label: 'Rating', sortable: true, span: 1 },
    { key: 'completion', label: 'Status', sortable: true, span: 1 }
  ];
  */

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
        <div className="grid grid-cols-10 h-full">
          {/* Title + Fandom - now with tooltip */}
          <div className="px-4 py-3 col-span-3 relative group">
            <div 
              className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-full"
              title={`${work.title}`} // Simple HTML tooltip
            >
              {work.url ? (
                <a 
                  href={`https://archiveofourown.org${work.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ao3-red dark:hover:text-ao3-red transition-colors"
                >
                  {work.title}
                </a>
              ) : (
                work.title
              )}
            </div>
            
            {/* Custom tooltip that appears on hover */}
            <div className="opacity-0 bg-black text-white text-xs rounded py-1 px-2 absolute z-10 group-hover:opacity-100 transition-opacity duration-300 -top-2 left-4 transform -translate-y-full w-auto max-w-xs pointer-events-none">
              {work.title}
            </div>
            
            <div 
              className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-full"
              title={work.fandoms.map(f => f.name).join(', ')}
            >
              {work.fandoms.map(f => f.name).join(', ')}
            </div>
          </div>

          {/* Author - with tooltip for long names */}
          <div className="px-4 py-3 col-span-2 relative group">
            <div 
              className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-full"
              title={work.author}
            >
              {work.authorUrl ? (
                <a 
                  href={`https://archiveofourown.org${work.authorUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ao3-red dark:hover:text-ao3-red transition-colors"
                >
                  {work.author}
                </a>
              ) : (
                work.author
              )}
            </div>
            <div className="opacity-0 bg-black text-white text-xs rounded py-1 px-2 absolute z-10 group-hover:opacity-100 transition-opacity duration-300 -top-2 left-4 transform -translate-y-full w-auto max-w-xs pointer-events-none">
              {work.author}
            </div>
          </div>

          {/* Word Count - narrower */}
          <div className="px-4 py-3 col-span-1">
            <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
              {work.stats.wordCount.toLocaleString()}
            </div>
          </div>

          {/* Visits - narrower */}
          <div className="px-4 py-3 col-span-1">
            <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
              {work.userStats.visits}
            </div>
          </div>

          {/* Last Visited */}
          <div className="px-4 py-3 col-span-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {work.userStats.lastVisited}
            </div>
          </div>

          {/* Rating - narrower */}
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

          {/* Status - narrower */}
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
            {/* Updated header with grid-cols-12 */}
            <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-10">
                {/* Title header - wider (col-span-4) */}
                <div
                  onClick={() => handleSort('title')}
                  className={`
                    px-4 py-3 text-left text-xs font-medium uppercase tracking-wider col-span-3
                    cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600
                    ${sortConfig.key === 'title' 
                      ? 'text-ao3-red dark:text-white bg-gray-100 dark:bg-gray-600' 
                      : 'text-gray-500 dark:text-gray-300'}
                  `}
                >
                  <div className="flex items-center space-x-1">
                    <span>Title</span>
                    {sortConfig.key === 'title' && (
                      <Icon 
                        icon={sortConfig.direction === 'asc' ? 'sort-asc' : 'sort-desc'} 
                        size="sm"
                      />
                    )}
                  </div>
                </div>

                {/* Author header - medium width (col-span-2) */}
                <div
                  onClick={() => handleSort('author')}
                  className={`
                    px-4 py-3 text-left text-xs font-medium uppercase tracking-wider col-span-2
                    cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600
                    ${sortConfig.key === 'author' 
                      ? 'text-ao3-red dark:text-white bg-gray-100 dark:bg-gray-600' 
                      : 'text-gray-500 dark:text-gray-300'}
                  `}
                >
                  <div className="flex items-center space-x-1">
                    <span>Author</span>
                    {sortConfig.key === 'author' && (
                      <Icon 
                        icon={sortConfig.direction === 'asc' ? 'sort-asc' : 'sort-desc'} 
                        size="sm"
                      />
                    )}
                  </div>
                </div>

                {/* Words header - narrow (col-span-1) */}
                <div
                  onClick={() => handleSort('stats.wordCount')}
                  className={`
                    px-4 py-3 text-left text-xs font-medium uppercase tracking-wider col-span-1
                    cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600
                    ${sortConfig.key === 'stats.wordCount' 
                      ? 'text-ao3-red dark:text-white bg-gray-100 dark:bg-gray-600' 
                      : 'text-gray-500 dark:text-gray-300'}
                  `}
                >
                  <div className="flex items-center space-x-1">
                    <span>Words</span>
                    {sortConfig.key === 'stats.wordCount' && (
                      <Icon 
                        icon={sortConfig.direction === 'asc' ? 'sort-asc' : 'sort-desc'} 
                        size="sm"
                      />
                    )}
                  </div>
                </div>

                {/* Visits header - narrow (col-span-1) */}
                <div
                  onClick={() => handleSort('userStats.visits')}
                  className={`
                    px-4 py-3 text-left text-xs font-medium uppercase tracking-wider col-span-1
                    cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600
                    ${sortConfig.key === 'userStats.visits' 
                      ? 'text-ao3-red dark:text-white bg-gray-100 dark:bg-gray-600' 
                      : 'text-gray-500 dark:text-gray-300'}
                  `}
                >
                  <div className="flex items-center space-x-1">
                    <span>Visits</span>
                    {sortConfig.key === 'userStats.visits' && (
                      <Icon 
                        icon={sortConfig.direction === 'asc' ? 'sort-asc' : 'sort-desc'} 
                        size="sm"
                      />
                    )}
                  </div>
                </div>

                {/* Last Visited header - medium width (col-span-2) */}
                <div
                  onClick={() => handleSort('userStats.lastVisited')}
                  className={`
                    px-4 py-3 text-left text-xs font-medium uppercase tracking-wider col-span-1
                    cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600
                    ${sortConfig.key === 'userStats.lastVisited' 
                      ? 'text-ao3-red dark:text-white bg-gray-100 dark:bg-gray-600' 
                      : 'text-gray-500 dark:text-gray-300'}
                  `}
                >
                  <div className="flex items-center space-x-1">
                    <span>Last Visited</span>
                    {sortConfig.key === 'userStats.lastVisited' && (
                      <Icon 
                        icon={sortConfig.direction === 'asc' ? 'sort-asc' : 'sort-desc'} 
                        size="sm"
                      />
                    )}
                  </div>
                </div>

                {/* Rating header - narrow (col-span-1) */}
                <div
                  onClick={() => handleSort('rating')}
                  className={`
                    px-4 py-3 text-left text-xs font-medium uppercase tracking-wider col-span-1
                    cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600
                    ${sortConfig.key === 'rating' 
                      ? 'text-ao3-red dark:text-white bg-gray-100 dark:bg-gray-600' 
                      : 'text-gray-500 dark:text-gray-300'}
                  `}
                >
                  <div className="flex items-center space-x-1">
                    <span>Rating</span>
                    {sortConfig.key === 'rating' && (
                      <Icon 
                        icon={sortConfig.direction === 'asc' ? 'sort-asc' : 'sort-desc'} 
                        size="sm"
                      />
                    )}
                  </div>
                </div>

                {/* Status header - narrow (col-span-1) */}
                <div
                  onClick={() => handleSort('completion')}
                  className={`
                    px-4 py-3 text-left text-xs font-medium uppercase tracking-wider col-span-1
                    cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600
                    ${sortConfig.key === 'completion' 
                      ? 'text-ao3-red dark:text-white bg-gray-100 dark:bg-gray-600' 
                      : 'text-gray-500 dark:text-gray-300'}
                  `}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {sortConfig.key === 'completion' && (
                      <Icon 
                        icon={sortConfig.direction === 'asc' ? 'sort-asc' : 'sort-desc'} 
                        size="sm"
                      />
                    )}
                  </div>
                </div>
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