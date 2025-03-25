// src/components/Navigation/TabBar.tsx
import React from 'react';
import { Container } from '../common/Container';
import { Icon } from '../common/Icon';
import { useData } from '../../context/DataContext';

export const TabBar: React.FC = () => {
  const { activeTab, setActiveTab, works } = useData();

  const tabs = [
    { id: 'table', label: 'Table View', icon: 'table' },
    { id: 'stats', label: 'Statistics', icon: 'chart-bar' },
    { id: 'visualizations', label: 'Visualizations', icon: 'chart-pie' }
  ];

  // Don't show tabs if no data is loaded
  if (works.length === 0) return null;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 border-b border-ao3-mediumgray dark:border-gray-700">
      <Container>
        <nav className="flex" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center space-x-2 py-4 px-4 border-b-2 font-medium text-base
                ${activeTab === tab.id
                  ? 'ao3-tab-active'
                  : 'ao3-tab hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'}
              `}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              <Icon icon={tab.icon as any} size="sm" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </Container>
    </div>
  );
};