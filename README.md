# AO3 History Explorer

AO3 History Explorer is a comprehensive web application designed to help Archive of Our Own (AO3) users analyze and export their reading history. The application works together with the [AO3-History-Exporter](https://github.com/yourusername/AO3-History-Exporter) browser extension to provide a seamless experience for exploring your AO3 reading habits.

![AO3 History Explorer Screenshot](screenshot.png)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Technical Details](#technical-details)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

AO3 History Explorer allows you to:

- Analyze your AO3 reading history with detailed statistics
- Filter and sort your reading history in ways not possible on AO3 itself
- Visualize your reading patterns with charts and graphs
- Export your history in multiple formats (JSON, CSV, Excel)

The application consists of two components:
1. A browser extension that exports your AO3 reading history data
2. This web application that processes, displays, and analyzes that data

All data processing happens client-side in your browser, ensuring your reading history remains private.

## Features

### Data Import
- Seamless integration with the AO3-History-Exporter browser extension
- Direct JSON file upload for previously exported data
- URL parameter support for extension integration

### Interactive Data Table
- View all your reading history in a sortable, filterable table
- Search across all fields (titles, authors, fandoms, etc.)
- Filter by multiple criteria simultaneously:
  - Fandom
  - Author
  - Category (M/M, F/F, etc.)
  - Completion status
  - Word count range
  - And more
- Pagination for large datasets with adjustable rows per page

### Statistics & Visualizations
- Summary statistics:
  - Total works read
  - Total words read
  - Average word count
  - Most visited work
  - Top authors
  - Top fandoms
- Visual charts:
  - Fandom distribution
  - Word count distribution
  - Rating distribution
  - Category distribution (M/M, F/F, etc.)

### Export Options
- Export to Excel (.xlsx)
- Export to CSV
- Export to JSON

### User Experience
- Dark/light mode toggle
- Responsive design
- Collapsible filter panel
- Fast performance even with large datasets (6000+ works)

## System Requirements

- Modern web browser (Chrome, Firefox, Edge, Safari)
- For extension users: Chrome or Firefox with the AO3-History-Exporter extension installed

## Installation

### Web Application Setup (for developers)

```bash
# Clone the repository
git clone https://github.com/yourusername/ao3-history-explorer.git
cd ao3-history-explorer

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Browser Extension Setup

Visit the [AO3-History-Exporter](https://github.com/yourusername/AO3-History-Exporter) repository for installation instructions.

## Usage

### With Browser Extension

1. Install the AO3-History-Exporter browser extension
2. Navigate to your AO3 reading history page
3. Click the extension button in your browser toolbar
4. The extension will collect your history data and redirect you to AO3 History Explorer with your data
5. Explore, analyze, and export your reading history

### With Direct File Upload

1. If you've previously exported your data as a JSON file:
2. Visit the AO3 History Explorer web application
3. Click "Upload File" and select your JSON data file
4. The application will load and display your reading history

### Analyzing Your Data

#### Table View
- Sort any column by clicking its header
- Filter using the expandable filter panel
- Search across all fields using the search box
- Adjust rows per page and navigate between pages
- Export your filtered data using the export buttons

#### Statistics View
- View summary statistics about your reading habits
- See your most-read authors and fandoms
- Analyze your reading patterns

#### Visualizations View
- Explore your reading history through charts:
  - Fandom distribution
  - Word count distribution
  - Rating distribution
  - Relationship category distribution

## Technical Details

AO3 History Explorer is built with modern web technologies:

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Build Tool**: Vite
- **Charts**: Chart.js with react-chartjs-2
- **Table Virtualization**: react-window for handling large datasets
- **Export Functionality**: xlsx, file-saver

All data processing happens client-side in the browser, ensuring user privacy.

## Project Structure

```
ao3-history-explorer/
├── src/
│   ├── components/
│   │   ├── common/             # Reusable UI components
│   │   ├── DataImport/         # File and URL import components
│   │   ├── DataTable/          # Table view and filtering
│   │   ├── Layout/             # App layout components
│   │   ├── Navigation/         # Navigation components
│   │   ├── Stats/              # Statistics components
│   │   ├── Visualization/      # Chart components
│   │   └── ExportSection/      # Export functionality
│   ├── context/
│   │   ├── DataContext.tsx     # Main data state management
│   │   └── ThemeContext.tsx    # Theme (dark/light) management
│   ├── types/
│   │   └── AO3Types.ts         # TypeScript type definitions
│   ├── utils/
│   │   ├── dataProcessing.ts   # Data processing utilities
│   │   └── exportUtils.ts      # Export functionality
│   ├── App.tsx                 # Main application component
│   └── main.tsx                # Application entry point
└── package.json
```

### Key Components

- **URLImport**: Processes data passed via URL from the browser extension
- **FileUpload**: Handles direct JSON file uploads
- **FilterPanel**: Manages all filtering options
- **WorksTable**: Displays the reading history with sorting and pagination
- **StatisticsPanel**: Shows summary statistics and analysis
- **ChartPanel**: Displays various visualizations of the data
- **ExportButtons**: Provides export functionality in different formats

### Data Flow

1. Data is imported via URL parameter or file upload
2. The DataContext manages the application state
3. Filtering and sorting are applied in memory
4. Components render views of the filtered/sorted data
5. Export functions format and download the data in the chosen format

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Guidelines

- Keep privacy in mind - all data processing should happen client-side
- Maintain performance with large datasets (some users have 6000+ works)
- Follow the existing code style and patterns
- Add tests for new functionality
- Update documentation as needed

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Archive of Our Own (AO3)](https://archiveofourown.org/) for providing the reading history functionality
- All contributors to the open-source libraries used in this project
- The AO3 user community for inspiration and feedback

---

_Note: AO3 History Explorer is not affiliated with or endorsed by Archive of Our Own or the Organization for Transformative Works._
