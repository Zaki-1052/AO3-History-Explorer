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
      
      <footer className="bg-white dark:bg-gray-800 border-t border-ao3-mediumgray dark:border-gray-700 py-6 mt-6">
  <Container>
    <div className="flex flex-col md:flex-row justify-between items-center">
      {/* Left side - Project info */}
      <div className="mb-4 md:mb-0 text-center md:text-left">
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          AO3 History Explorer &copy; {new Date().getFullYear()}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          This tool is not affiliated with Archive of Our Own (AO3).
        </p>
      </div>
      
      {/* Right side - Links */}
      <div className="flex flex-col items-center md:items-end">
        <div className="flex space-x-4 mb-2">
          <a 
            href="https://github.com/Zaki-1052/AO3-History-Explorer" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            aria-label="Project Repository"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
          <a 
            href="https://zaki-1052.github.io/portfolio/index.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            aria-label="Developer Portfolio"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          <a 
            href="https://github.com/Zaki-1052/AO3-History-Explorer" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            View Source
          </a> | Developed by <a 
            href="https://zaki-1052.github.io/portfolio/index.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Zaki
          </a>
        </p>
      </div>
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