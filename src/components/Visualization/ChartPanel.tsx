// src/components/Visualization/ChartPanel.tsx
import React, { useMemo } from 'react';
import { Card } from '../common/Card';
import { useData } from '../../context/DataContext';
import { generateChartData } from '../../utils/dataProcessing';
import { Chart } from './Chart';

export const ChartPanel: React.FC = () => {
  const { works } = useData();
  
  const chartData = useMemo(() => {
    return generateChartData(works);
  }, [works]);

  return (
    <div className="space-y-6">
      <Card title="Top Fandoms Distribution">
        <div className="py-2">
          <Chart
            type="pie"
            data={chartData.fandomDistribution}
            height={340}
          />
        </div>
      </Card>
      
      <Card title="Word Count Distribution">
        <div className="py-2">
          <Chart
            type="bar"
            data={chartData.wordCountDistribution}
            height={340}
          />
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Category Distribution">
          <div className="py-2">
            <Chart
              type="doughnut"
              data={chartData.categoryDistribution}
              height={340}
            />
          </div>
        </Card>
        
        <Card title="Rating Distribution">
          <div className="py-2">
            <Chart
              type="pie"
              data={chartData.ratingDistribution}
              height={340}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};