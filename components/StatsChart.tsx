'use client';

import { Stats } from '@/lib/types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface StatsChartProps {
  stats: Stats;
  user1Name: string;
  user2Name: string;
}

const COLORS = {
  user1: '#ec4899', // Pink-500
  user2: '#f9a8d4', // Pink-300
  easy: '#10b981',  // Green-500
  medium: '#f59e0b', // Orange-500
  hard: '#ef4444',   // Red-500
};

export default function StatsChart({ stats, user1Name, user2Name }: StatsChartProps) {
  // User distribution data
  const userData = [
    { name: user1Name, value: stats.byUser[user1Name] || 0 },
    { name: user2Name, value: stats.byUser[user2Name] || 0 },
  ];

  // Difficulty distribution data
  const difficultyData = [
    { name: 'Easy', value: stats.byDifficulty.Easy, fill: COLORS.easy },
    { name: 'Medium', value: stats.byDifficulty.Medium, fill: COLORS.medium },
    { name: 'Hard', value: stats.byDifficulty.Hard, fill: COLORS.hard },
  ].filter(item => item.value > 0);

  // Top tags data
  const tagData = Object.entries(stats.byTag)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-8">
      {/* User Distribution - Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          👥 Problems Solved by User
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={userData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value, percent }) => 
                `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {userData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 0 ? COLORS.user1 : COLORS.user2} 
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Difficulty Distribution - Bar Chart */}
      {difficultyData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            📊 Problems by Difficulty
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={difficultyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '2px solid #fbcfe8',
                  borderRadius: '12px' 
                }} 
              />
              <Bar 
                dataKey="value" 
                animationBegin={0}
                animationDuration={800}
                radius={[8, 8, 0, 0]}
              >
                {difficultyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Top Tags - Bar Chart */}
      {tagData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            🏷️ Top 10 Tags
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={tagData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="name" type="category" stroke="#6b7280" width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '2px solid #fbcfe8',
                  borderRadius: '12px' 
                }} 
              />
              <Bar 
                dataKey="value" 
                fill={COLORS.user1}
                animationBegin={0}
                animationDuration={800}
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
}
