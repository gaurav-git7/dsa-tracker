'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const user1Name = process.env.NEXT_PUBLIC_USER1_NAME || 'Gaurav';
  const user2Name = process.env.NEXT_PUBLIC_USER2_NAME || 'Her Name';
  const correctPin = process.env.NEXT_PUBLIC_SHARED_PIN || '1234';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (pin === correctPin) {
      localStorage.setItem('pinAuth', 'true');
      
      // Celebrate with confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#f9a8d4', '#fce7f3'],
      });

      toast.success(`Welcome back, ${user1Name} & ${user2Name}! 💕`);
      router.push('/');
    } else {
      toast.error('Invalid PIN. Try again! 🔒');
      setPin('');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card text-center space-y-6">
          {/* Logo */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 1 
            }}
            className="flex justify-center"
          >
            <Heart className="h-20 w-20 text-pink-500 fill-pink-500" />
          </motion.div>

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              DSA Progress Tracker
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {user1Name} & {user2Name}'s Coding Journey ✨
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-pink-400" />
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter shared PIN"
                className="input-field pl-12 text-center text-lg tracking-widest"
                required
                disabled={isLoading}
                maxLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <Heart className="h-5 w-5" />
                  <span>Enter Together</span>
                </>
              )}
            </button>
          </form>

          {/* Hint */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            💡 Default PIN: 1234 (Change in .env.local)
          </p>
        </div>
      </motion.div>
    </div>
  );
}
