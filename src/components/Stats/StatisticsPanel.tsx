// src/components/Stats/StatisticsPanel.tsx
import React, { useMemo } from 'react';
import { Card } from '../common/Card';
import { useData } from '../../context/DataContext';
import { generateStats } from '../../utils/dataProcessing';

export const StatisticsPanel: React.FC = () => {
  const { works } = useData();
  
  const stats = useMemo(() => {
    return generateStats(works);
  }, [works]);

  return (
    <div className="space-y-6">
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Works</h3>
            <p className="text-2xl font-semibold text-ao3-darkgray dark:text-white mt-1">
              {stats.totalWorks.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Unique Authors</h3>
            <p className="text-2xl font-semibold text-ao3-darkgray dark:text-white mt-1">
              {stats.totalAuthors.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Words Read</h3>
            <p className="text-2xl font-semibold text-ao3-darkgray dark:text-white mt-1">
              {stats.totalWordCount.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Avg Words Per Work</h3>
            <p className="text-2xl font-semibold text-ao3-darkgray dark:text-white mt-1">
              {stats.averageWordCount.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Top Authors">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {stats.topAuthors.map((author, index) => (
              <li key={author.name} className="py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 
                                   rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                    {index + 1}
                  </span>
                  <span className="text-ao3-darkgray dark:text-ao3-lightgray">{author.name}</span>
                </div>
                <span className="text-gray-500 dark:text-gray-400 font-medium">
                  {author.count} {author.count === 1 ? 'work' : 'works'}
                </span>
              </li>
            ))}
          </ul>
        </Card>
        
        <Card title="Top Fandoms">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {stats.topFandoms.map((fandom, index) => (
              <li key={fandom.name} className="py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 
                                   rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                    {index + 1}
                  </span>
                  <span className="text-ao3-darkgray dark:text-ao3-lightgray truncate max-w-xs">
                    {fandom.name}
                  </span>
                </div>
                <span className="text-gray-500 dark:text-gray-400 font-medium">
                  {fandom.count} {fandom.count === 1 ? 'work' : 'works'}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Top Relationships">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {stats.topRelationships.map((relationship, index) => (
              <li key={relationship.name} className="py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 
                                   rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                    {index + 1}
                  </span>
                  <span className="text-ao3-darkgray dark:text-ao3-lightgray truncate max-w-xs">
                    {relationship.name}
                  </span>
                </div>
                <span className="text-gray-500 dark:text-gray-400 font-medium">
                  {relationship.count} {relationship.count === 1 ? 'work' : 'works'}
                </span>
              </li>
            ))}
          </ul>
        </Card>
        
        <Card title="Top Tags">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {stats.topFreeformTags.map((tag, index) => (
              <li key={tag.name} className="py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 
                                   rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                    {index + 1}
                  </span>
                  <span className="text-ao3-darkgray dark:text-ao3-lightgray truncate max-w-xs">
                    {tag.name}
                  </span>
                </div>
                <span className="text-gray-500 dark:text-gray-400 font-medium">
                  {tag.count} {tag.count === 1 ? 'work' : 'works'}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};