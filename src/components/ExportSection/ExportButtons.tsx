// src/components/ExportSection/ExportButtons.tsx
import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';
import { Card } from '../common/Card';
import { useData } from '../../context/DataContext';
import { exportToExcel, exportToJSON, exportToCSV } from '../../utils/exportUtils';

export const ExportButtons: React.FC = () => {
  const { works } = useData();
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExportToExcel = () => {
    try {
      setExportError(null);
      exportToExcel(works);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Export failed';
      setExportError(message);
    }
  };

  const handleExportToJSON = () => {
    try {
      setExportError(null);
      exportToJSON(works);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Export failed';
      setExportError(message);
    }
  };

  const handleExportToCSV = () => {
    try {
      setExportError(null);
      exportToCSV(works);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Export failed';
      setExportError(message);
    }
  };

  return (
    <Card title="Export Data">
      {exportError && (
        <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-700 dark:text-red-300">{exportError}</p>
        </div>
      )}
      <div className="space-y-3">
        <Button
          onClick={handleExportToExcel}
          disabled={works.length === 0}
          fullWidth
          className="flex items-center justify-center"
        >
          <Icon icon="download" size="sm" className="mr-2" />
          Export to Excel
        </Button>

        <Button
          onClick={handleExportToCSV}
          disabled={works.length === 0}
          variant="secondary"
          fullWidth
          className="flex items-center justify-center"
        >
          <Icon icon="download" size="sm" className="mr-2" />
          Export to CSV
        </Button>

        <Button
          onClick={handleExportToJSON}
          disabled={works.length === 0}
          variant="secondary"
          fullWidth
          className="flex items-center justify-center"
        >
          <Icon icon="download" size="sm" className="mr-2" />
          Export to JSON
        </Button>
      </div>
    </Card>
  );
};