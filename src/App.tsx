// src/App.tsx
//import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider, useData } from './context/DataContext';
import { Container } from './components/common/Container';
import { Header } from './components/Layout/Header';
import { TabBar } from './components/Navigation/TabBar';
import { FileUpload } from './components/DataImport/FileUpload';
import { URLImport } from './components/DataImport/URLImport';
import { WorksTable } from './components/DataTable/WorksTable';
import { StatisticsPanel } from './components/Stats/StatisticsPanel';
import { ChartPanel } from './components/Visualization/ChartPanel';
import { FilterPanel } from './components/DataTable/FilterPanel';
import { ExportButtons } from './components/ExportSection/ExportButtons';

function AppContent() {
  const { activeTab, isLoading, error, works } = useData();

  return (
    <div className="min-h-screen flex flex-col bg-ao3-beige dark:bg-ao3-charcoal">
      <Header />
      
      {/* Hidden component that loads data from URL parameters */}
      <URLImport />
      
      <TabBar />
      
      <main className="flex-grow py-6">
        <Container>
          {isLoading && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-6 text-blue-700 dark:text-blue-300">
              <p>Loading your data...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md mb-6 text-red-700 dark:text-red-300">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}
          
          {works.length === 0 && !isLoading ? (
            <div className="max-w-2xl mx-auto">
              <FileUpload />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <FilterPanel />
                <ExportButtons />
              </div>
              
              <div className="lg:col-span-3">
                {activeTab === 'table' && <WorksTable />}
                {activeTab === 'stats' && <StatisticsPanel />}
                {activeTab === 'visualizations' && <ChartPanel />}
              </div>
            </div>
          )}
        </Container>
      </main>
      
      <footer className="bg-white dark:bg-gray-800 border-t border-ao3-mediumgray dark:border-gray-700 py-4 mt-6">
        <Container>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              AO3 History Explorer &copy; {new Date().getFullYear()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              This tool is not affiliated with Archive of Our Own (AO3).
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;