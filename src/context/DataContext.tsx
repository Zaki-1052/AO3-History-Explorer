// src/context/DataContext.tsx
import { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { WorkData, SortConfig, FilterOptions } from '../types/AO3Types';

interface DataContextType {
  works: WorkData[];
  setWorks: (works: WorkData[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  sortConfig: SortConfig;
  setSortConfig: (config: SortConfig) => void;
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTab: 'table' | 'stats' | 'visualizations';
  setActiveTab: (tab: 'table' | 'stats' | 'visualizations') => void;
  availableFilters: {
    fandoms: string[];
    authors: string[];
    ratings: string[];
    tags: string[];
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [works, setWorks] = useState<WorkData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'userStats.visits', direction: 'desc' });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    fandoms: [],
    authors: [],
    ratings: [],
    categories: [], // Add this
    minWordCount: 0,
    maxWordCount: Infinity,
    minVisits: 0,
    maxVisits: Infinity,
    tags: [],
    completionStatus: 'all'
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'table' | 'stats' | 'visualizations'>('table');
  const [availableFilters, setAvailableFilters] = useState({
    fandoms: [] as string[],
    authors: [] as string[],
    ratings: [] as string[],
    tags: [] as string[]
  });

  // Extract available filters when works change
  // In your DataContext.tsx file, make sure this effect is properly set up
  useEffect(() => {
    if (works.length > 0) {
      // Extract unique fandoms, authors, etc.
      const fandomSet = new Set<string>();
      const authorSet = new Set<string>();
      const ratingSet = new Set<string>();
      const categorySet = new Set<string>(); // Add this
      const tagSet = new Set<string>();
      
      works.forEach(work => {
        // Collect fandoms
        work.fandoms.forEach(fandom => fandomSet.add(fandom.name));
        
        // Collect authors
        authorSet.add(work.author);
        
        // Collect ratings
        ratingSet.add(work.rating);
        
        // Collect categories
        if (work.category) {
          // Split categories like "F/F, Gen" into individual categories
          work.category.split(',').forEach(cat => {
            categorySet.add(cat.trim());
          });
        }
        
        // Collect tags
        work.tags.relationships.forEach(tag => tagSet.add(tag.name));
        work.tags.characters.forEach(tag => tagSet.add(tag.name));
        work.tags.freeforms.forEach(tag => tagSet.add(tag.name));
      });
      
      setAvailableFilters({
        fandoms: Array.from(fandomSet).sort(),
        authors: Array.from(authorSet).sort(),
        ratings: Array.from(ratingSet).sort(),
        categories: Array.from(categorySet).sort(), // Add this
        tags: Array.from(tagSet).sort()
      });
    }
  }, [works]);

  const value = {
    works,
    setWorks,
    isLoading,
    setIsLoading,
    error,
    setError,
    sortConfig,
    setSortConfig,
    filterOptions,
    setFilterOptions,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    availableFilters
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};