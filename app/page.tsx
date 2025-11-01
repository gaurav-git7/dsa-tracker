'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Problem, Stats } from '@/lib/types';
import { calculateStreak, countSolvedToday } from '@/lib/utils';
import AuthGuard from '@/components/AuthGuard';
import StatsChart from '@/components/StatsChart';
import { motion } from 'framer-motion';
import { Trophy, Target, Flame, Plus, List, TrendingUp, Heart } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
      // By user
      stats.byUser[problem.solvedBy] = (stats.byUser[problem.solvedBy] || 0) + 1;

      // By difficulty
      stats.byDifficulty[problem.difficulty]++;

      // By tag
      problem.tags.forEach((tag) => {
        stats.byTag[tag] = (stats.byTag[tag] || 0) + 1;
      });
    });

    setStats(stats);
  };

  const getLeader = () => {
    if (!stats) return null;
    const user1Count = stats.byUser[user1Name] || 0;
    const user2Count = stats.byUser[user2Name] || 0;
    
    if (user1Count > user2Count) return user1Name;
    if (user2Count > user1Count) return user2Name;
    return 'Tie';
  };

  if (isLoading) {
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

  return (
    <AuthGuard>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
            Welcome Back, {user1Name} & {user2Name}! 💕
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Let's track our coding journey together ✨
          </p>
        </motion.div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card text-center"
          >
            <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats?.totalProblems || 0}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Total Problems</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card text-center"
          >
            <Flame className="h-12 w-12 text-orange-500 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats?.streak || 0}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Day Streak 🔥</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card text-center"
          >
            <Target className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats?.solvedToday || 0}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Solved Today</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card text-center"
          >
            <TrendingUp className="h-12 w-12 text-pink-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {getLeader() === 'Tie' ? '🤝 Tie!' : `👑 ${getLeader()}`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Current Leader</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <Link
            href="/add"
            className="card hover:scale-105 transition-transform duration-300 cursor-pointer group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-pink-100 dark:bg-pink-900 p-4 rounded-xl group-hover:bg-pink-200 dark:group-hover:bg-pink-800 transition-colors">
                <Plus className="h-8 w-8 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  Add Problem
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Log a new LeetCode problem
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/list"
            className="card hover:scale-105 transition-transform duration-300 cursor-pointer group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-pink-100 dark:bg-pink-900 p-4 rounded-xl group-hover:bg-pink-200 dark:group-hover:bg-pink-800 transition-colors">
                <List className="h-8 w-8 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  View All Problems
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Browse and filter problems
                </p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Charts */}
        {stats && (
          <StatsChart stats={stats} user1Name={user1Name} user2Name={user2Name} />
        )}
      </div>
    </AuthGuard>
  );
}
