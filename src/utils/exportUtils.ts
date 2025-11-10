// src/utils/exportUtils.ts
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { WorkData } from '../types/AO3Types';
import { isDeletedWork } from './dataProcessing';

// Transform deleted works to show consistent values with UI display
const transformWorkForExport = (work: WorkData): WorkData => {
  if (isDeletedWork(work)) {
    return {
      ...work,
      title: "Deleted Work",
      author: "Unknown"
    };
  }
  return work;
};

// Export works data to Excel
export const exportToExcel = (works: WorkData[], filename = 'ao3_history.xlsx'): void => {
  try {
    // Transform deleted works to match UI display
    const transformedWorks = works.map(transformWorkForExport);

    // Transform data to match the format of the original script
    const exportData = transformedWorks.map(work => ({
      'Title': work.title || 'Unknown',
      'Author': work.author || 'Unknown',
      'Fandoms': work.fandoms.map(f => f.name).join(', ') || 'Unknown',
      'Word Count': work.stats.wordCount || 0,
      'Last Visited': work.userStats.lastVisited || 'Unknown',
      'Visits': work.userStats.visits || 0,
      'Rating': work.rating || 'Unknown',
      'Warnings': work.tags.warnings.map(w => w.name).join(', ') || 'Unknown',
      'Category': work.category || 'Unknown',
      'Status': work.completion || 'Unknown',
      'Kudos': work.stats.kudos || 0,
      'Comments': work.stats.comments || 0,
      'Bookmarks': work.stats.bookmarks || 0,
      'Hits': work.stats.hits || 0,
      'Work ID': work.id || 'Unknown',
      'Relationships': work.tags.relationships.map(r => r.name).join(', ') || '',
      'Characters': work.tags.characters.map(c => c.name).join(', ') || '',
      'Additional Tags': work.tags.freeforms.map(t => t.name).join(', ') || '',
      'Language': work.stats.language || 'Unknown',
      'Published': work.stats.publishDate || 'Unknown',
      'Chapters': work.stats.chapters || '?/?'
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AO3 History');

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error('Failed to export to Excel:', error);
    throw new Error('Failed to export to Excel. Please try again or check your browser permissions.');
  }
};

// Export works data to JSON
export const exportToJSON = (works: WorkData[], filename = 'ao3_history.json'): void => {
  try {
    // Transform deleted works to match UI display
    const transformedWorks = works.map(transformWorkForExport);

    const jsonString = JSON.stringify(transformedWorks, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, filename);
  } catch (error) {
    console.error('Failed to export to JSON:', error);
    throw new Error('Failed to export to JSON. Please try again or check your browser permissions.');
  }
};

// Export works data to CSV
export const exportToCSV = (works: WorkData[], filename = 'ao3_history.csv'): void => {
  try {
    // Transform deleted works to match UI display
    const transformedWorks = works.map(transformWorkForExport);

    // Transform data to match the format of the original script
    const exportData = transformedWorks.map(work => ({
      'Title': work.title || 'Unknown',
      'Author': work.author || 'Unknown',
      'Fandoms': work.fandoms.map(f => f.name).join(', ') || 'Unknown',
      'Word Count': work.stats.wordCount || 0,
      'Last Visited': work.userStats.lastVisited || 'Unknown',
      'Visits': work.userStats.visits || 0,
      'Rating': work.rating || 'Unknown',
      'Warnings': work.tags.warnings.map(w => w.name).join(', ') || 'Unknown',
      'Category': work.category || 'Unknown',
      'Status': work.completion || 'Unknown',
      'Kudos': work.stats.kudos || 0,
      'Comments': work.stats.comments || 0,
      'Bookmarks': work.stats.bookmarks || 0,
      'Hits': work.stats.hits || 0,
      'Work ID': work.id || 'Unknown'
    }));

    // Handle empty data case
    if (exportData.length === 0) {
      // Create an empty CSV with just headers
      const emptyRow = {
        'Title': '',
        'Author': '',
        'Fandoms': '',
        'Word Count': '',
        'Last Visited': '',
        'Visits': '',
        'Rating': '',
        'Warnings': '',
        'Category': '',
        'Status': '',
        'Kudos': '',
        'Comments': '',
        'Bookmarks': '',
        'Hits': '',
        'Work ID': ''
      };
      const headers = Object.keys(emptyRow).join(',');
      const blob = new Blob([headers], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, filename);
      return;
    }

    // Convert to CSV with headers
    const headers = Object.keys(exportData[0]).join(',');
    const rows = exportData.map(row =>
      Object.values(row).map(value =>
        // Handle commas and quotes in CSV data
        typeof value === 'string' && (value.includes(',') || value.includes('"'))
          ? `"${value.replace(/"/g, '""')}"`
          : value
      ).join(',')
    );

    const csvContent = [headers, ...rows].join('\n');

    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  } catch (error) {
    console.error('Failed to export to CSV:', error);
    throw new Error('Failed to export to CSV. Please try again or check your browser permissions.');
  }
};