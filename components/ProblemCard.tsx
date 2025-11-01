'use client';

import { useState } from 'react';
import { Problem } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, MessageCircle, Tag, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ProblemCardProps {
  problem: Problem;
}

export default function ProblemCard({ problem }: ProblemCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentUser, setCommentUser] = useState('');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'badge-easy';
      case 'Medium':
        return 'badge-medium';
      case 'Hard':
        return 'badge-hard';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !commentUser.trim()) {
      toast.error('Please fill in all fields!');
      return;
    }

    try {
      const problemRef = doc(db, 'problems', problem.id);
      await updateDoc(problemRef, {
        comments: arrayUnion({
          user: commentUser,
          text: newComment,
          createdAt: Timestamp.now(),
        }),
      });

      toast.success('Comment added! 💬');
      setNewComment('');
      setCommentUser('');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card hover:scale-[1.02] transition-transform duration-300"
    >
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {problem.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className={`badge ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              {problem.tags.map((tag, index) => (
                <span key={index} className="tag-chip">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <a
            href={problem.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm py-2 px-4 inline-flex items-center space-x-2 self-start sm:self-auto"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View</span>
          </a>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>{problem.solvedBy}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(problem.createdAt)}</span>
          </div>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{problem.comments?.length || 0} Comments</span>
          </button>
        </div>

        {/* Notes */}
        {problem.notes && (
          <div className="bg-pink-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">{problem.notes}</p>
          </div>
        )}

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-pink-200 dark:border-gray-700 pt-4 space-y-4"
            >
              {/* Existing Comments */}
              {problem.comments && problem.comments.length > 0 && (
                <div className="space-y-3">
                  {problem.comments.map((comment, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-pink-600 dark:text-pink-400">
                          {comment.user}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {comment.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
              <div className="space-y-3">
                <input
                  type="text"
                  value={commentUser}
                  onChange={(e) => setCommentUser(e.target.value)}
                  placeholder="Your name"
                  className="input-field"
                />
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  className="input-field"
                />
                <button onClick={handleAddComment} className="btn-primary w-full sm:w-auto">
                  Add Comment
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
