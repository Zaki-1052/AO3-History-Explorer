// src/utils/dataProcessing.ts
import { WorkData, SortConfig, FilterOptions, StatSummary, ChartData } from '../types/AO3Types';

// Validate that imported data matches the WorkData structure
export const validateWorkData = (data: unknown): data is WorkData[] => {
  if (!Array.isArray(data)) {
    return false;
  }

  // Check a sample of items for structure validation
  // For large datasets, only validate first 10 items for performance
  const sampleSize = Math.min(data.length, 10);

  for (let i = 0; i < sampleSize; i++) {
    const work = data[i];

    // Check if work is an object
    if (!work || typeof work !== 'object') {
      return false;
    }

    // Check required top-level properties
    if (
      typeof work.id !== 'string' ||
      typeof work.title !== 'string' ||
      typeof work.author !== 'string' ||
      !Array.isArray(work.fandoms) ||
      typeof work.rating !== 'string' ||
      typeof work.category !== 'string' ||
      typeof work.completion !== 'string'
    ) {
      return false;
    }

    // Check nested tags structure
    if (
      !work.tags ||
      typeof work.tags !== 'object' ||
      !Array.isArray(work.tags.warnings) ||
      !Array.isArray(work.tags.relationships) ||
      !Array.isArray(work.tags.characters) ||
      !Array.isArray(work.tags.freeforms)
    ) {
      return false;
    }

    // Check nested stats structure
    if (
      !work.stats ||
      typeof work.stats !== 'object' ||
      typeof work.stats.wordCount !== 'number' ||
      typeof work.stats.kudos !== 'number'
    ) {
      return false;
    }

    // Check nested userStats structure
    if (
      !work.userStats ||
      typeof work.userStats !== 'object' ||
      typeof work.userStats.lastVisited !== 'string' ||
      typeof work.userStats.visits !== 'number'
    ) {
      return false;
    }
  }

  return true;
};

// Detect deleted/unavailable works based on consistent patterns
export const isDeletedWork = (work: WorkData): boolean => {
  return (
    work.id === "" &&
    work.title === "Unknown Title" &&
    work.author === "Anonymous" &&
    work.url === null &&
    work.authorUrl === null &&
    work.fandoms.length === 0 &&
    work.stats.wordCount === 0 &&
    work.userStats.lastVisited === "Unknown" &&
    work.rating === "Unknown" &&
    work.category === "Unknown" &&
    work.completion === "Unknown"
  );
};

// Date field keys that need chronological sorting
const DATE_FIELDS = new Set([
  'userStats.lastVisited',
  'stats.publishDate'
]);

// Parse date string into Date object with fallback handling
const parseDate = (dateString: string | undefined | null): Date => {
  if (!dateString) return new Date(0); // Fallback to epoch for null/undefined
  
  try {
    const parsed = new Date(dateString);
    // Check if parsed date is valid
    if (isNaN(parsed.getTime())) {
      console.warn(`Invalid date format: ${dateString}`);
      return new Date(0); // Fallback to epoch for invalid dates
    }
    return parsed;
  } catch (error) {
    console.warn(`Error parsing date: ${dateString}`, error);
    return new Date(0); // Fallback to epoch on parsing error
  }
};

// Get nested property from an object using string path
// Returns unknown to force type checking at call sites
export const getNestedProperty = (obj: Record<string, any>, path: string): unknown => {
  if (!obj || typeof obj !== 'object') return undefined;

  const parts = path.split('.');
  let current: any = obj;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    if (typeof current !== 'object') {
      return undefined;
    }
    current = current[part];
  }

  return current;
};

// Sort works based on sort configuration with proper date handling
export const sortWorks = (works: WorkData[], sortConfig: SortConfig): WorkData[] => {
  return [...works].sort((a, b) => {
    const aValue = getNestedProperty(a, sortConfig.key);
    const bValue = getNestedProperty(b, sortConfig.key);
    
    // Handle null or undefined values
    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
    if (bValue === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
    
    // Handle date fields specially for chronological sorting
    if (DATE_FIELDS.has(sortConfig.key)) {
      const aDate = parseDate(aValue as string);
      const bDate = parseDate(bValue as string);
      
      const comparison = aDate.getTime() - bDate.getTime();
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    }
    
    // Handle numbers specially
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    // Handle strings (non-date)
    const aString = String(aValue).toLowerCase();
    const bString = String(bValue).toLowerCase();
    
    if (aString < bString) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aString > bString) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

// Filter works based on search term and filter options
export const filterWorks = (works: WorkData[], searchTerm: string, filterOptions: FilterOptions): WorkData[] => {
  return works.filter(work => {
    // Text search filter
    if (searchTerm && searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      const inTitle = work.title.toLowerCase().includes(searchLower);
      const inAuthor = work.author.toLowerCase().includes(searchLower);
      const inFandoms = work.fandoms.some(f => f.name.toLowerCase().includes(searchLower));
      const inTags = Object.values(work.tags).some(tagArr => 
        tagArr.some(tag => tag.name.toLowerCase().includes(searchLower))
      );
      
      if (!(inTitle || inAuthor || inFandoms || inTags)) {
        return false;
      }
    }
    
    // Fandom filter
    if (filterOptions.fandoms.length > 0) {
      if (!work.fandoms.some(f => filterOptions.fandoms.includes(f.name))) {
        return false;
      }
    }
    
    // Author filter
    if (filterOptions.authors.length > 0) {
      if (!filterOptions.authors.includes(work.author)) {
        return false;
      }
    }
    
    // Rating filter
    if (filterOptions.ratings.length > 0) {
      if (!filterOptions.ratings.includes(work.rating)) {
        return false;
      }
    }

    // Category filter
    if (filterOptions.categories.length > 0) {
      // If the work has no category info, filter it out
      if (!work.category) return false;
      
      // Check if any of the work's categories match our filter
      const workCategories = work.category.split(',').map(cat => cat.trim());
      if (!filterOptions.categories.some(cat => workCategories.includes(cat))) {
        return false;
      }
    }
    
    // Word count range
    if (work.stats.wordCount < filterOptions.minWordCount) {
      return false;
    }
    if (filterOptions.maxWordCount !== Infinity && work.stats.wordCount > filterOptions.maxWordCount) {
      return false;
    }
    
    // Visit count range
    if (work.userStats.visits < filterOptions.minVisits) {
      return false;
    }
    if (filterOptions.maxVisits !== Infinity && work.userStats.visits > filterOptions.maxVisits) {
      return false;
    }
    
    // Completion status
    if (filterOptions.completionStatus !== 'all') {
      const isComplete = work.completion.toLowerCase().includes('complete');
      if (filterOptions.completionStatus === 'complete' && !isComplete) {
        return false;
      }
      if (filterOptions.completionStatus === 'incomplete' && isComplete) {
        return false;
      }
    }
    
    // Tag filters
    if (filterOptions.tags.length > 0) {
      const allTags = [
        ...work.tags.warnings.map(t => t.name),
        ...work.tags.relationships.map(t => t.name),
        ...work.tags.characters.map(t => t.name),
        ...work.tags.freeforms.map(t => t.name)
      ];
      
      if (!filterOptions.tags.some(tag => allTags.includes(tag))) {
        return false;
      }
    }
    
    return true;
  });
};

// Generate statistics from works data
export const generateStats = (works: WorkData[]): StatSummary => {
  // Filter out deleted works for accurate statistics
  const validWorks = works.filter(work => !isDeletedWork(work));
  
  if (validWorks.length === 0) {
    return {
      totalWorks: 0,
      totalAuthors: 0,
      totalWordCount: 0,
      averageWordCount: 0,
      totalVisits: 0,
      mostVisitedWork: { title: '', visits: 0 },
      topAuthors: [],
      topFandoms: [],
      topRelationships: [],
      topFreeformTags: []
    };
  }
  
  // Calculate total word count and visits
  const totalWordCount = validWorks.reduce((sum, work) => sum + work.stats.wordCount, 0);
  const totalVisits = validWorks.reduce((sum, work) => sum + work.userStats.visits, 0);
  
  // Count unique authors
  const authorCounts: Record<string, number> = {};
  const fandomCounts: Record<string, number> = {};
  const relationshipCounts: Record<string, number> = {};
  const freeformTagCounts: Record<string, number> = {};
  
  validWorks.forEach(work => {
    // Author counts
    authorCounts[work.author] = (authorCounts[work.author] || 0) + 1;
    
    // Fandom counts
    work.fandoms.forEach(fandom => {
      fandomCounts[fandom.name] = (fandomCounts[fandom.name] || 0) + 1;
    });
    
    // Relationship counts
    work.tags.relationships.forEach(relationship => {
      relationshipCounts[relationship.name] = (relationshipCounts[relationship.name] || 0) + 1;
    });
    
    // Freeform tag counts
    work.tags.freeforms.forEach(tag => {
      freeformTagCounts[tag.name] = (freeformTagCounts[tag.name] || 0) + 1;
    });
  });
  
  // Most visited work
  const mostVisitedWork = validWorks.reduce((prev, curr) => {
    return prev.userStats.visits > curr.userStats.visits ? prev : curr;
  });
  
  // Convert author map to sorted array
  const topAuthors = Object.entries(authorCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 33);
  
  // Convert fandoms map to sorted array
  const topFandoms = Object.entries(fandomCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);
    
  // Convert relationships map to sorted array
  const topRelationships = Object.entries(relationshipCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 34);
    
  // Convert freeform tags map to sorted array
  const topFreeformTags = Object.entries(freeformTagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 34);
  
  return {
    totalWorks: validWorks.length,
    totalAuthors: Object.keys(authorCounts).length,
    totalWordCount,
    averageWordCount: Math.round(totalWordCount / validWorks.length),
    totalVisits,
    mostVisitedWork: {
      title: mostVisitedWork.title,
      visits: mostVisitedWork.userStats.visits
    },
    topAuthors,
    topFandoms,
    topRelationships,
    topFreeformTags
  };
};

// Generate chart data from works
export const generateChartData = (works: WorkData[]): Record<string, ChartData> => {
  // Filter out deleted works for clean visualizations
  const validWorks = works.filter(work => !isDeletedWork(work));
  
  if (validWorks.length === 0) {
    return {
      fandomDistribution: {
        labels: [],
        datasets: [{
          label: 'Fandoms',
          data: [],
          backgroundColor: []
        }]
      },
      wordCountDistribution: {
        labels: [],
        datasets: [{
          label: 'Word Count',
          data: [],
          backgroundColor: ''
        }]
      },
      ratingDistribution: {
        labels: [],
        datasets: [{
          label: 'Ratings',
          data: [],
          backgroundColor: []
        }]
      },
      categoryDistribution: {
        labels: [],
        datasets: [{
          label: 'Categories',
          data: [],
          backgroundColor: []
        }]
      }
    };
  }
  
  // Fandom distribution - count works by fandom
  const fandomCounts: Record<string, number> = {};
  validWorks.forEach(work => {
    work.fandoms.forEach(fandom => {
      fandomCounts[fandom.name] = (fandomCounts[fandom.name] || 0) + 1;
    });
  });
  
  // Sort and take top 10 fandoms
  const topFandoms = Object.entries(fandomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  // Word count distribution - group works by word count range
  const wordCountRanges = {
    '< 1K': 0,
    '1K-5K': 0,
    '5K-10K': 0,
    '10K-25K': 0,
    '25K-50K': 0,
    '50K-100K': 0,
    '> 100K': 0
  };
  
  validWorks.forEach(work => {
    const wordCount = work.stats.wordCount;
    if (wordCount < 1000) {
      wordCountRanges['< 1K']++;
    } else if (wordCount < 5000) {
      wordCountRanges['1K-5K']++;
    } else if (wordCount < 10000) {
      wordCountRanges['5K-10K']++;
    } else if (wordCount < 25000) {
      wordCountRanges['10K-25K']++;
    } else if (wordCount < 50000) {
      wordCountRanges['25K-50K']++;
    } else if (wordCount < 100000) {
      wordCountRanges['50K-100K']++;
    } else {
      wordCountRanges['> 100K']++;
    }
  });
  
  // Rating distribution
  const ratingCounts: Record<string, number> = {};
  validWorks.forEach(work => {
    ratingCounts[work.rating] = (ratingCounts[work.rating] || 0) + 1;
  });
  
  // Prepare chart colors
  const fandomColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#8AC24A', '#F44336', '#9C27B0', '#3F51B5'
  ];
  
  const ratingColors = {
    'General Audiences': '#4BC0C0',
    'Teen And Up Audiences': '#FFCE56',
    'Mature': '#FF9F40',
    'Explicit': '#FF6384',
    'Not Rated': '#9966FF'
  };

  // Category distribution (M/M, F/F, etc.)
  // Category distribution (M/M, F/F, etc.) - improved version
  const categoryCountMap = {
    'M/M': 0,
    'F/F': 0,
    'F/M': 0,
    'Gen': 0,
    'Multi': 0,
    'Other': 0,
    'No Category': 0
  };
  
  validWorks.forEach(work => {
    // Parse the category string to identify the base categories
    const categoryStr = work.category.trim();
    
    if (!categoryStr || categoryStr === 'Unknown' || categoryStr === 'No category') {
      categoryCountMap['No Category']++;
      return;
    }
    
    // Check for each base category
    let foundCategory = false;
    if (categoryStr.includes('M/M')) {
      categoryCountMap['M/M']++;
      foundCategory = true;
    }
    if (categoryStr.includes('F/F')) {
      categoryCountMap['F/F']++;
      foundCategory = true;
    }
    if (categoryStr.includes('F/M')) {
      categoryCountMap['F/M']++;
      foundCategory = true;
    }
    if (categoryStr.includes('Gen')) {
      categoryCountMap['Gen']++;
      foundCategory = true;
    }
    if (categoryStr.includes('Multi')) {
      categoryCountMap['Multi']++;
      foundCategory = true;
    }
    
    // If we didn't find any of the main categories, count as "Other"
    if (!foundCategory && categoryStr !== 'Other') {
      categoryCountMap['Other']++;
    } else if (categoryStr === 'Other') {
      categoryCountMap['Other']++;
    }
  });
  
  // Filter out categories with zero counts
  const filteredCategories = Object.entries(categoryCountMap)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);
    
  // Category-specific colors
  const categoryColors = {
    'M/M': '#36A2EB', // Blue
    'F/F': '#FF6384', // Pink
    'F/M': '#FFCE56', // Yellow
    'Gen': '#4BC0C0', // Teal
    'Multi': '#9966FF', // Purple
    'Other': '#FF9F40', // Orange
    'No Category': '#BBBBBB', // Gray
  };
    
  // Build chart data objects
  return {
    fandomDistribution: {
      labels: topFandoms.map(([name]) => name),
      datasets: [{
        label: 'Works per Fandom',
        data: topFandoms.map(([, count]) => count),
        backgroundColor: fandomColors.slice(0, topFandoms.length)
      }]
    },
    wordCountDistribution: {
      labels: Object.keys(wordCountRanges),
      datasets: [{
        label: 'Number of Works',
        data: Object.values(wordCountRanges),
        backgroundColor: '#36A2EB'
      }]
    },
    ratingDistribution: {
      labels: Object.keys(ratingCounts),
      datasets: [{
        label: 'Works by Rating',
        data: Object.values(ratingCounts),
        backgroundColor: Object.keys(ratingCounts).map(rating => 
          ratingColors[rating as keyof typeof ratingColors] || '#9966FF'
        )
      }]
    },
    categoryDistribution: {
      labels: filteredCategories.map(([name]) => name),
      datasets: [{
        label: 'Work Categories',
        data: filteredCategories.map(([, count]) => count),
        backgroundColor: filteredCategories.map(([name]) => 
          categoryColors[name as keyof typeof categoryColors] || '#999999'
        )
      }]
    }
  };
};

// Extract filter options from works
export const extractFilterOptions = (works: WorkData[]) => {
  // Filter out deleted works to clean up filter options
  const validWorks = works.filter(work => !isDeletedWork(work));
  
  const fandoms = new Set<string>();
  const authors = new Set<string>();
  const ratings = new Set<string>();
  const tags = new Set<string>();
  
  validWorks.forEach(work => {
    // Collect fandoms
    work.fandoms.forEach(fandom => fandoms.add(fandom.name));
    
    // Collect authors
    authors.add(work.author);
    
    // Collect ratings
    ratings.add(work.rating);
    
    // Collect tags
    work.tags.relationships.forEach(tag => tags.add(tag.name));
    work.tags.characters.forEach(tag => tags.add(tag.name));
    work.tags.freeforms.forEach(tag => tags.add(tag.name));
  });
  
  return {
    fandoms: Array.from(fandoms).sort(),
    authors: Array.from(authors).sort(),
    ratings: Array.from(ratings).sort(),
    tags: Array.from(tags).sort()
  };
};