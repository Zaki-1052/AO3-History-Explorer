// src/types/AO3Types.ts
export interface WorkData {
    id: string;
    pageNumber: number;
    title: string;
    url: string | null;
    author: string;
    authorUrl: string | null;
    fandoms: Array<{
      name: string;
      url: string;
    }>;
    rating: string;
    warning: string;
    category: string;
    completion: string;
    summary: string;
    tags: {
      warnings: Array<{
        name: string;
        url: string;
      }>;
      relationships: Array<{
        name: string;
        url: string;
      }>;
      characters: Array<{
        name: string;
        url: string;
      }>;
      freeforms: Array<{
        name: string;
        url: string;
      }>;
    };
    stats: {
      wordCount: number;
      chapters: string;
      kudos: number;
      comments: number;
      bookmarks: number;
      hits: number;
      language: string;
      publishDate: string;
    };
    userStats: {
      lastVisited: string;
      visits: number;
    };
    series: {
      name: string;
      url: string;
      part: string;
    } | null;
  }
  
  export type SortKey = string;
  export type SortDirection = 'asc' | 'desc';
  
  export interface SortConfig {
    key: SortKey;
    direction: SortDirection;
  }
  
  // src/types/AO3Types.ts
export interface FilterOptions {
  fandoms: string[];
  authors: string[];
  ratings: string[];
  categories: string[]; // Added this line
  minWordCount: number;
  maxWordCount: number;
  minVisits: number;
  maxVisits: number;
  tags: string[];
  completionStatus: 'all' | 'complete' | 'incomplete';
}
  
  export interface ChartData {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string[] | string;
      borderColor?: string[] | string;
      borderWidth?: number;
    }[];
  }
  
  export interface StatSummary {
    totalWorks: number;
    totalAuthors: number;
    totalWordCount: number;
    averageWordCount: number;
    totalVisits: number;
    mostVisitedWork: {
      title: string;
      visits: number;
    };
    topAuthors: {
      name: string;
      count: number;
    }[];
    topFandoms: {
      name: string;
      count: number;
    }[];
    topRelationships: {
      name: string;
      count: number;
    }[];
    topFreeformTags: {
      name: string;
      count: number;
    }[];
  }