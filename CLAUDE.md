# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Testing
No test framework configured - verify changes by running the development server and testing functionality manually.

## Architecture

### Core Data Flow
1. **Data Import**: Works data enters via URL parameters (from browser extension) or file upload
2. **State Management**: DataContext manages all application state using React Context API
3. **Processing**: Data is filtered/sorted in memory and passed to view components
4. **Export**: Processed data can be exported in JSON/CSV/Excel formats

### Key State Management
- **DataContext** (`src/context/DataContext.tsx`): Central state for works data, filters, sorting, and active tab
- **ThemeContext** (`src/context/ThemeContext.tsx`): Manages dark/light theme switching
- All data processing happens client-side for privacy

### Component Architecture
- **App.tsx**: Main layout with ThemeProvider > DataProvider > AppContent
- **Layout Components**: Header, TabBar, Container for consistent UI structure
- **Data Import**: URLImport (hidden, processes URL params) and FileUpload components
- **Data Views**: WorksTable, StatisticsPanel, ChartPanel based on activeTab
- **Filtering**: FilterPanel with ExportButtons in sidebar layout

### Performance Considerations
- Uses `react-window` for table virtualization to handle large datasets (6000+ works)
- All filtering/sorting operations are in-memory
- Chart.js with react-chartjs-2 for visualization performance

### Data Structure
WorkData interface defines the complete structure of AO3 works including:
- Basic metadata (title, author, fandoms, rating, category)
- Tags (relationships, characters, freeforms, warnings)
- Stats (word count, kudos, comments, bookmarks, hits)
- User stats (visits, last visited date)

### Key Technologies
- React 19 with TypeScript
- Tailwind CSS for styling
- @tanstack/react-table for table functionality
- Chart.js for visualizations
- xlsx and file-saver for export functionality
- Vite for build tooling

### Browser Extension Integration
The app is designed to work with the AO3-History-Exporter browser extension which:
- Passes data via URL parameters to URLImport component
- Uses base64 encoded JSON data in URL hash
- URLImport automatically processes and loads this data on page load