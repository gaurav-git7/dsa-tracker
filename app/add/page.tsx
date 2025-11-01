'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { fetchLeetCodeProblem, isValidLeetCodeUrl } from '@/lib/leetcode';
import AuthGuard from '@/components/AuthGuard';
import { motion } from 'framer-motion';
import { Loader2, Check, AlertCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

export default function AddProblemPage() {
  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [solvedBy, setSolvedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();

  const user1Name = process.env.NEXT_PUBLIC_USER1_NAME || 'Gaurav';
  const user2Name = process.env.NEXT_PUBLIC_USER2_NAME || 'Her Name';

  const handleFetchMetadata = async () => {
    if (!link.trim()) {
      toast.error('Please enter a LeetCode URL');
      return;
    }

    if (!isValidLeetCodeUrl(link)) {
      toast.error('Invalid LeetCode URL format');
      return;
    }

    setIsFetching(true);

    try {
      const metadata = await fetchLeetCodeProblem(link);
      setTitle(metadata.title);
      setDifficulty(metadata.difficulty as 'Easy' | 'Medium' | 'Hard');
      setTags(metadata.tags);
      toast.success('Problem details fetched! ✨');
    } catch (error) {
      toast.error('Failed to fetch problem details. Please fill manually.');
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !link.trim() || !solvedBy) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      await addDoc(collection(db, 'problems'), {
        title: title.trim(),
        link: link.trim(),
        difficulty,
        tags,
        solvedBy,
        notes: notes.trim(),
        createdAt: Timestamp.now(),
        comments: [],
      });

      // Celebrate!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#f9a8d4', '#fce7f3'],
      });

      toast.success(`Nice job, ${solvedBy}! 🎉`);
      
      // Reset form
      setLink('');
      setTitle('');
      setDifficulty('Medium');
      setTags([]);
      setSolvedBy('');
      setNotes('');

      // Redirect to list after 1 second
      setTimeout(() => {
        router.push('/list');
      }, 1000);
    } catch (error) {
      console.error('Error adding problem:', error);
      toast.error('Failed to add problem. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Add New Problem ✨
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Log your LeetCode progress
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="card space-y-6">
            {/* LeetCode Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                LeetCode Problem Link *
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://leetcode.com/problems/..."
                  className="input-field flex-1"
                  required
                />
                <button
                  type="button"
                  onClick={handleFetchMetadata}
                  disabled={isFetching}
                  className="btn-secondary whitespace-nowrap"
                >
                  {isFetching ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                      Fetching...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 inline mr-2" />
                      Auto-Fill
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Problem Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Two Sum"
                className="input-field"
                required
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Easy', 'Medium', 'Hard'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                      difficulty === level
                        ? level === 'Easy'
                          ? 'bg-green-500 text-white shadow-lg'
                          : level === 'Medium'
                          ? 'bg-orange-500 text-white shadow-lg'
                          : 'bg-red-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="e.g., Array, Dynamic Programming"
                  className="input-field flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="btn-secondary whitespace-nowrap"
                >
                  Add Tag
                </button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="tag-chip flex items-center space-x-2"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-pink-900 dark:hover:text-pink-100"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Solved By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Solved By *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[user1Name, user2Name].map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSolvedBy(name)}
                    className={`py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                      solvedBy === name
                        ? 'bg-pink-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any thoughts or learnings..."
                rows={4}
                className="input-field"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                  Adding Problem...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5 inline mr-2" />
                  Add Problem
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AuthGuard>
  );
}
