'use client';

import { Problem } from '@/lib/types';
import { motion } from 'framer-motion';

interface TagCloudProps {
  problems: Problem[];
  selectedTag: string | null;
  onTagClick: (tag: string | null) => void;
}

export default function TagCloud({ problems, selectedTag, onTagClick }: TagCloudProps) {
  // Count tag frequencies
  const tagCounts = problems.reduce((acc, problem) => {
    problem.tags.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // Sort tags by frequency
  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20); // Show top 20 tags

  if (sortedTags.length === 0) {
    return null;
  }

  const maxCount = Math.max(...sortedTags.map(([_, count]) => count));

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        🏷️ Tag Cloud
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {selectedTag && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => onTagClick(null)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            ✕ Clear Filter
          </motion.button>
        )}
        
        {sortedTags.map(([tag, count]) => {
          const isSelected = selectedTag === tag;
          const size = Math.max(0.8, (count / maxCount) * 1.5); // Scale between 0.8 and 1.5
          
          return (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTagClick(isSelected ? null : tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                isSelected
                  ? 'bg-pink-500 text-white shadow-lg'
                  : 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200 hover:bg-pink-200 dark:hover:bg-pink-800'
              }`}
              style={{
                fontSize: `${size}rem`,
              }}
            >
              {tag} <span className="opacity-75">({count})</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
