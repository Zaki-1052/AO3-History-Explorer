// src/components/DataImport/FileUpload.tsx
import React, { useState, useRef } from 'react';
import { Card } from '../common/Card';
import { Icon } from '../common/Icon';
import { useData } from '../../context/DataContext';

export const FileUpload: React.FC = () => {
  const { setWorks, setIsLoading, setError } = useData();
  const [isDragging, setIsDragging] = useState(false);
  const [filename, setFilename] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (!file) return;

    setFilename(file.name);
    setIsLoading(true);
    setError(null);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        setWorks(jsonData);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to parse JSON file:', err);
        setError('Failed to parse JSON file. Please make sure it\'s a valid AO3 history JSON file.');
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Error reading file. Please try again.');
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card title="Import Your Reading History">
      <div className="mb-3 text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3.5 rounded-md border border-blue-200 dark:border-blue-800">
        <p className="font-medium text-ao3-red dark:text-blue-300 mb-1.5 text-sm">How to Get Your Reading History</p>
        <p className="mb-1.5 text-sm">
          To use this app, you need to first export your AO3 history using one of these options:
        </p>
        <ol className="list-decimal list-inside space-y-1 mb-2 ml-1 text-sm">
          <li>Install the <a 
            href="https://addons.mozilla.org/en-US/firefox/addon/ao3-history-exporter/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-ao3-red dark:text-blue-300 hover:underline font-medium"
          >
            AO3 History Exporter
          </a> browser extension for Firefox</li>
          <li>Go to your AO3 reading history page</li>
          <li>Click the "Export Reading History" button to export your data</li>
        </ol>
        <p className="mt-2 mb-1 font-medium text-sm underline decoration-1 underline-offset-2">Alternative Installation:</p>
        <p className="text-sm">For Chrome, you can install as a <a 
          href="https://github.com/Zaki-1052/AO3-History-Exporter#installation" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-ao3-red dark:text-blue-300 hover:underline font-medium"
        >
          TamperMonkey script
        </a> from the <a 
          href="https://github.com/Zaki-1052/AO3-History-Exporter/blob/main/ao3-history-exporter.js" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-ao3-red dark:text-blue-300 hover:underline font-medium"
        >
          GitHub repository
        </a>.</p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          Note: If you encounter rate limits while exporting, please pause the export and reference the 
          <a 
            href="https://github.com/Zaki-1052/AO3-History-Exporter#usage" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:underline mx-1 dark:text-blue-300"
          >
            documentation
          </a>
          for troubleshooting.
        </p>
      </div>

      <div
        className={`
          mt-2 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isDragging ? 'border-ao3-red bg-ao3-red/5' : 'border-gray-300 dark:border-gray-600 hover:border-ao3-red dark:hover:border-ao3-red'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept=".json"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <Icon icon="upload" size="lg" className="text-gray-400" />
          
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300">
              Drag and drop your JSON file here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              or click to browse files
            </p>
          </div>
          
          {filename && (
            <div className="text-sm text-ao3-red dark:text-ao3-red">
              Selected: {filename}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
        <p className="font-medium mb-1">Privacy Information</p>
        <p>
          This web app processes all data in your browser.
          No information is sent to any server. Your reading history remains private.
        </p>
      </div>
    </Card>
  );
};