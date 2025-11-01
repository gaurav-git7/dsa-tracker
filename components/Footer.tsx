'use client';

import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t-2 border-pink-200 dark:border-pink-900 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-pink-500 fill-pink-500 animate-pulse" />
            <span>by {process.env.NEXT_PUBLIC_USER1_NAME || 'Gaurav'} & {process.env.NEXT_PUBLIC_USER2_NAME || 'Her Name'}</span>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} DSA Progress Tracker
          </div>
        </div>
      </div>
    </footer>
  );
}
