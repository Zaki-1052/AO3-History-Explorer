# Changelog

All notable changes to AO3 History Explorer since the last README update.

## [Released] - 2025-06-08

### Added
- **Updated Date Column**: Added a new "Updated" column to the works table showing when works were last updated
- **Clickable Links**: Title and author names in the table are now clickable links that open the original AO3 work and author pages in a new tab
- **Enhanced Grid System**: Extended Tailwind configuration to support 20-column grid layout for finer control over table column widths
- **Improved File Upload Instructions**: Added comprehensive instructions and guidance to the file upload component
- **Deleted Works Detection**: Implemented automatic detection and handling of deleted/unavailable AO3 works in reading history

### Fixed
- **Date Sorting Issue**: Fixed chronological sorting for "Last Visited" and "Last Updated" columns - dates now sort chronologically (2020 → 2025) instead of lexicographically ("02 Oct" before "06 Apr")
- **Statistics Accuracy**: Fixed inflated author counts caused by deleted works - Anonymous author now shows accurate count (e.g., 10 actual works vs 17 with deleted works included)
- **Chart Data Quality**: Eliminated "Unknown" ratings, empty fandoms, and zero word counts from visualizations
- **Filter Option Cleanliness**: Removed "Unknown" values from rating and category filter dropdowns
- **Export Data Consistency**: Fixed inconsistency where exported files showed raw deleted work data ("Unknown Title", "Anonymous") instead of UI display values ("Deleted Work", "Unknown")

### Changed
- **Table Layout Optimization**: Adjusted column widths for better title display while maintaining author column readability
- **Grid Column Configuration**: Modified table to use a 20-column grid system (instead of 10) for more granular column width control
- **Visual Assets**: Updated application icon (PNG and SVG formats) and favicon
- **Screenshot**: Updated application screenshot to reflect current interface
- **Deleted Work Display**: Deleted works now appear as "Deleted Work" in table with italic gray styling and disabled links

### Technical Improvements
- **Date Processing**: Enhanced `sortWorks` function in `dataProcessing.ts` with intelligent date field detection and robust date parsing with error handling
- **Tailwind Configuration**: Added custom 20-column grid template to `tailwind.config.cjs`
- **Component Updates**: Enhanced `WorksTable.tsx` with clickable links and improved column layout
- **Documentation**: Added `CHANGELOG.md` file for development context and instructions
- **Data Processing**: Added `isDeletedWork()` detection function for comprehensive deleted work identification
- **Statistics Pipeline**: Updated `generateStats()`, `generateChartData()`, and `extractFilterOptions()` to filter deleted works
- **Export Consistency**: Added `transformWorkForExport()` function to ensure exported data matches UI display values
- **Non-destructive Processing**: All filtering occurs at processing layer while preserving original JSON data integrity

---

**Note**: Changes are listed in reverse chronological order (newest first). This changelog covers commits from March 26, 2025 to June 8, 2025.