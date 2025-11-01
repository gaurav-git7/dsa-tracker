'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Problem, Stats } from '@/lib/types';
import { calculateStreak, countSolvedToday } from '@/lib/utils';
import AuthGuard from '@/components/AuthGuard';
import StatsChart from '@/components/StatsChart';
import { motion } from 'framer-motion';
import { Trophy, Calendar, TrendingUp, Heart, Award } from 'lucide-react';

export default function StatsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const user1Name = process.env.NEXT_PUBLIC_USER1_NAME || 'Gaurav';
  const user2Name = process.env.NEXT_PUBLIC_USER2_NAME || 'Her Name';

  useEffect(() => {
    const q = query(collection(db, 'problems'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const problemsData: Problem[] = [];
      snapshot.forEach((doc) => {
        problemsData.push({ id: doc.id, ...doc.data() } as Problem);
      });
      
      setProblems(problemsData);
      calculateStats(problemsData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const calculateStats = (problemsData: Problem[]) => {
    const stats: Stats = {
      totalProblems: problemsData.length,
      byUser: {},
      byDifficulty: { Easy: 0, Medium: 0, Hard: 0 },
      byTag: {},
      streak: calculateStreak(problemsData),
      solvedToday: countSolvedToday(problemsData),
    };

    problemsData.forEach((problem) => {
      stats.byUser[problem.solvedBy] = (stats.byUser[problem.solvedBy] || 0) + 1;
      stats.byDifficulty[problem.difficulty]++;
      problem.tags.forEach((tag) => {
        stats.byTag[tag] = (stats.byTag[tag] || 0) + 1;
      });
    });

    setStats(stats);
  };

  const getPercentage = (count: number, total: number) => {
    return total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
  };

  if (isLoading || !stats) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Heart className="h-12 w-12 text-pink-500 fill-pink-500" />
          </motion.div>
        </div>
      </AuthGuard>
    );
  }

  const user1Count = stats.byUser[user1Name] || 0;
  const user2Count = stats.byUser[user2Name] || 0;

  return (
    <AuthGuard>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Detailed Statistics 📊
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your coding journey in numbers ✨
          </p>
        </motion.div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="card text-center"
          >
            <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {stats.totalProblems}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Total Problems</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card text-center"
          >
            <Calendar className="h-12 w-12 text-blue-500 mx-auto mb-3" />
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {stats.streak}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Day Streak 🔥</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="card text-center"
          >
            <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {stats.solvedToday}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Solved Today</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="card text-center"
          >
            <Award className="h-12 w-12 text-purple-500 mx-auto mb-3" />
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {Object.keys(stats.byTag).length}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Unique Tags</p>
          </motion.div>
        </div>

        {/* User Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            👥 User Comparison
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user1Name}
                </span>
                <span className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                  {user1Count}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-pink-500 to-pink-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${getPercentage(user1Count, stats.totalProblems)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getPercentage(user1Count, stats.totalProblems)}% of total
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user2Name}
                </span>
                <span className="text-2xl font-bold text-pink-400 dark:text-pink-300">
                  {user2Count}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-pink-400 to-pink-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${getPercentage(user2Count, stats.totalProblems)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getPercentage(user2Count, stats.totalProblems)}% of total
              </p>
            </div>
          </div>
        </motion.div>

        {/* Difficulty Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            🎯 Difficulty Breakdown
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {(['Easy', 'Medium', 'Hard'] as const).map((difficulty, index) => {
              const count = stats.byDifficulty[difficulty];
              const percentage = getPercentage(count, stats.totalProblems);
              const color = difficulty === 'Easy' ? 'green' : difficulty === 'Medium' ? 'orange' : 'red';
              
              return (
                <div key={difficulty} className="text-center">
                  <div className={`text-5xl font-bold text-${color}-500 mb-2`}>
                    {count}
                  </div>
                  <div className={`badge badge-${difficulty.toLowerCase()} text-lg px-4 py-2 mb-2`}>
                    {difficulty}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {percentage}% of total
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Charts */}
        <StatsChart stats={stats} user1Name={user1Name} user2Name={user2Name} />
      </div>
    </AuthGuard>
  );
}
