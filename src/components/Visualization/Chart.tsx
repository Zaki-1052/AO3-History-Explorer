// src/components/Visualization/Chart.tsx
import React, { useContext } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { ThemeContext } from '../../context/ThemeContext';
import { ChartData } from '../../types/AO3Types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  defaults
} from 'chart.js';

// Register necessary chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Set chart defaults to match theme
defaults.font.family = "'Lucida Grande', 'Lucida Sans Unicode', 'Verdana', 'Helvetica', sans-serif";

interface ChartProps {
  type: 'bar' | 'pie' | 'doughnut';
  data: ChartData;
  title?: string;
  height?: number;
}

export const Chart: React.FC<ChartProps> = ({ 
  type, 
  data, 
  title,
  height = 300
}) => {
  const { theme } = useContext(ThemeContext);
  
  const getChartOptions = () => {
    const textColor = theme === 'dark' ? '#EEEEEE' : '#333333';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: textColor,
            font: {
              size: 12
            }
          }
        },
        title: {
          display: !!title,
          text: title,
          color: textColor,
          font: {
            size: 16,
            weight: 'bold' as const
          }
        },
        tooltip: {
          titleColor: textColor,
          bodyColor: textColor,
        }
      },
      scales: type === 'bar' ? {
        x: {
          grid: {
            color: gridColor
          },
          ticks: {
            color: textColor
          }
        },
        y: {
          grid: {
            color: gridColor
          },
          ticks: {
            color: textColor
          }
        }
      } : undefined
    };
  };

  return (
    <div className="chart-container" style={{ height: `${height}px` }}>
      {type === 'bar' && <Bar data={data} options={getChartOptions()} />}
      {type === 'pie' && <Pie data={data} options={getChartOptions()} />}
      {type === 'doughnut' && <Doughnut data={data} options={getChartOptions()} />}
    </div>
  );
};