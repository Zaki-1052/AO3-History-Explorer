// src/components/DataTable/FilterPanel.tsx
import React, { useState } from 'react';
import { Icon } from '../common/Icon';
import { useData } from '../../context/DataContext';
import { FilterOptions } from '../../types/AO3Types'; // Make sure this import exists

export const FilterPanel: React.FC = () => {
  const { 
    filterOptions, 
    setFilterOptions, 
    searchTerm, 
    setSearchTerm,
    availableFilters
  } = useData();
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = <K extends keyof FilterOptions>(
    key: K, 
    value: FilterOptions[K]
  ) => {
    setFilterOptions({
      ...filterOptions,
      [key]: value
    });
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, key: 'fandoms' | 'authors' | 'ratings' | 'tags' | 'categories') => {
    const value = e.target.value;
    if (value === '') return;
    
    // Add to the array if not already there
    if (!filterOptions[key].includes(value)) {
      handleFilterChange(key, [...filterOptions[key], value]);
    }
    
    // Reset the select
    e.target.value = '';
  };
  
  const handleRemoveFilter = (key: 'fandoms' | 'authors' | 'ratings' | 'tags' | 'categories', value: string) => {
    handleFilterChange(key, filterOptions[key].filter(item => item !== value));
  };
  
  const handleClearAllFilters = () => {
    setFilterOptions({
      fandoms: [],
      authors: [],
      ratings: [],
      categories: [], // Added categories
      minWordCount: 0,
      maxWordCount: Infinity,
      minVisits: 0,
      maxVisits: Infinity,
      tags: [],
      completionStatus: 'all'
    });
    setSearchTerm('');
  };

  const hasActiveFilters = 
    filterOptions.fandoms.length > 0 || 
    filterOptions.authors.length > 0 || 
    filterOptions.ratings.length > 0 ||
    filterOptions.categories.length > 0 || // Added categories
    filterOptions.tags.length > 0 ||
    filterOptions.completionStatus !== 'all' ||
    filterOptions.minWordCount > 0 ||
    filterOptions.maxWordCount !== Infinity;

  // Define standard AO3 categories if they're not in availableFilters
  const standardCategories = [
    'M/M',
    'F/F', 
    'F/M',
    'Gen',
    'Multi',
    'Other'
  ];

  // Use available categories from data or fallback to standard ones
  const categoryOptions = availableFilters.categories?.length 
    ? availableFilters.categories 
    : standardCategories;

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      {/* Custom header with visible toggle button */}
      <div className="p-4 bg-gray-100 dark:bg-gray-800 flex justify-between items-center">
        <h3 className="font-medium">Filters</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {isExpanded ? 'Hide' : 'Show'}
        </button>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Search is always visible */}
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="search" size="sm" className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search in titles, authors, fandoms..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                      bg-white dark:bg-gray-700 text-ao3-darkgray dark:text-white
                      focus:ring-2 focus:ring-ao3-red focus:border-ao3-red"
          />
        </div>
        
        {/* Active filters summary */}
        {hasActiveFilters && (
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Filters</h4>
              <button
                onClick={handleClearAllFilters}
                className="text-xs text-ao3-red hover:text-ao3-darkred dark:hover:text-red-400"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOptions.fandoms.map(fandom => (
                <span key={fandom} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                  {fandom}
                  <button
                    type="button"
                    className="ml-1.5 inline-flex text-blue-500 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-200"
                    onClick={() => handleRemoveFilter('fandoms', fandom)}
                  >
                    <Icon icon="x" size="sm" />
                  </button>
                </span>
              ))}
              
              {/* Show active category filters */}
              {filterOptions.categories.map(category => (
                <span key={category} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                  {category}
                  <button
                    type="button"
                    className="ml-1.5 inline-flex text-purple-500 dark:text-purple-300 hover:text-purple-600 dark:hover:text-purple-200"
                    onClick={() => handleRemoveFilter('categories', category)}
                  >
                    <Icon icon="x" size="sm" />
                  </button>
                </span>
              ))}
              
              {/* Other active filters would go here */}
            </div>
          </div>
        )}
        
        {/* Expanded filter controls */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            {/* Fandom Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fandom Filter
              </label>
              <select
                className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                           bg-white dark:bg-gray-700 text-ao3-darkgray dark:text-white
                           focus:ring-2 focus:ring-ao3-red focus:border-ao3-red"
                onChange={(e) => handleSelectChange(e, 'fandoms')}
                value=""
              >
                <option value="" disabled>Select a fandom... ({availableFilters.fandoms?.length || 0} available)</option>
                {availableFilters.fandoms?.map(fandom => (
                  <option key={fandom} value={fandom}>{fandom}</option>
                ))}
              </select>
            </div>
            
            {/* NEW: Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category Filter
              </label>
              <select
                className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                           bg-white dark:bg-gray-700 text-ao3-darkgray dark:text-white
                           focus:ring-2 focus:ring-ao3-red focus:border-ao3-red"
                onChange={(e) => handleSelectChange(e, 'categories')}
                value=""
              >
                <option value="" disabled>Select a category...</option>
                {categoryOptions.map((category: string) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Author Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Author Filter
              </label>
              <select
                className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                           bg-white dark:bg-gray-700 text-ao3-darkgray dark:text-white
                           focus:ring-2 focus:ring-ao3-red focus:border-ao3-red"
                onChange={(e) => handleSelectChange(e, 'authors')}
                value=""
              >
                <option value="" disabled>Select an author... ({availableFilters.authors?.length || 0} available)</option>
                {availableFilters.authors?.map(author => (
                  <option key={author} value={author}>{author}</option>
                ))}
              </select>
            </div>
            
            {/* Completion Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Completion Status
              </label>
              <select
                className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                           bg-white dark:bg-gray-700 text-ao3-darkgray dark:text-white
                           focus:ring-2 focus:ring-ao3-red focus:border-ao3-red"
                value={filterOptions.completionStatus}
                onChange={(e) => handleFilterChange('completionStatus', e.target.value as 'all' | 'complete' | 'incomplete')}
              >
                <option value="all">All Works</option>
                <option value="complete">Complete Works Only</option>
                <option value="incomplete">Work in Progress Only</option>
              </select>
            </div>
            
            {/* Word Count Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Word Count Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    placeholder="Min Words"
                    min="0"
                    value={filterOptions.minWordCount || ""}
                    onChange={(e) => handleFilterChange('minWordCount', e.target.value ? Number(e.target.value) : 0)}
                    className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                               bg-white dark:bg-gray-700 text-ao3-darkgray dark:text-white
                               focus:ring-2 focus:ring-ao3-red focus:border-ao3-red"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Max Words"
                    min="0"
                    value={filterOptions.maxWordCount === Infinity ? "" : filterOptions.maxWordCount}
                    onChange={(e) => handleFilterChange('maxWordCount', e.target.value ? Number(e.target.value) : Infinity)}
                    className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                               bg-white dark:bg-gray-700 text-ao3-darkgray dark:text-white
                               focus:ring-2 focus:ring-ao3-red focus:border-ao3-red"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};