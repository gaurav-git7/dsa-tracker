'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Problem } from '@/lib/types';
import { exportToCSV } from '@/lib/utils';
import AuthGuard from '@/components/AuthGuard';
import ProblemCard from '@/components/ProblemCard';
import TagCloud from '@/components/TagCloud';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Filter, Search, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ListPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'difficulty'>('date');

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
      setFilteredProblems(problemsData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = [...problems];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((problem) =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Difficulty filter
    if (selectedDifficulty) {
      filtered = filtered.filter((problem) => problem.difficulty === selectedDifficulty);
    }

    // User filter
    if (selectedUser) {
      filtered = filtered.filter((problem) => problem.solvedBy === selectedUser);
    }

    // Tag filter
    if (selectedTag) {
      filtered = filtered.filter((problem) => problem.tags.includes(selectedTag));
    }

    // Sort
    if (sortBy === 'difficulty') {
      const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
      filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
    }

    setFilteredProblems(filtered);
  }, [searchTerm, selectedDifficulty, selectedUser, selectedTag, sortBy, problems]);

  const handleExport = () => {
    exportToCSV(filteredProblems);
    toast.success('Exported successfully! 📥');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDifficulty(null);
    setSelectedUser(null);
    setSelectedTag(null);
    setSortBy('date');
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              All Problems 📋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredProblems.length} of {problems.length} problems
            </p>
          </div>
          
          <button
            onClick={handleExport}
            className="btn-secondary"
          >
            <Download className="h-5 w-5 inline mr-2" />
            Export CSV
          </button>
        </div>

        {/* Tag Cloud */}
        <TagCloud 
          problems={problems} 
          selectedTag={selectedTag} 
          onTagClick={setSelectedTag} 
        />

        {/* Filters */}
        <div className="card space-y-4">
          <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search problems..."
              className="input-field pl-12"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty || ''}
                onChange={(e) => setSelectedDifficulty(e.target.value || null)}
                className="input-field"
              >
                <option value="">All</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* User Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Solved By
              </label>
              <select
                value={selectedUser || ''}
                onChange={(e) => setSelectedUser(e.target.value || null)}
                className="input-field"
              >
                <option value="">All</option>
                <option value={user1Name}>{user1Name}</option>
                <option value={user2Name}>{user2Name}</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'difficulty')}
                className="input-field"
              >
                <option value="date">Date (Newest First)</option>
                <option value="difficulty">Difficulty</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="btn-secondary w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Problems List */}
        {filteredProblems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-12"
          >
            <p className="text-xl text-gray-500 dark:text-gray-400">
              No problems found. Try adjusting your filters! 🔍
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredProblems.map((problem) => (
                <ProblemCard key={problem.id} problem={problem} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
