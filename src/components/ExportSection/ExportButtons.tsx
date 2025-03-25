// src/components/ExportSection/ExportButtons.tsx
import React from 'react';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';
import { Card } from '../common/Card';
import { useData } from '../../context/DataContext';
import { exportToExcel, exportToJSON, exportToCSV } from '../../utils/exportUtils';

export const ExportButtons: React.FC = () => {
  const { works } = useData();
  
  const handleExportToExcel = () => {
    exportToExcel(works);
  };

  const handleExportToJSON = () => {
    exportToJSON(works);
  };

  const handleExportToCSV = () => {
    exportToCSV(works);
  };

  return (
    <Card title="Export Data">
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