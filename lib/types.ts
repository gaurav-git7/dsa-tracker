import { Timestamp } from 'firebase/firestore';

export interface Comment {
  user: string;
  text: string;
  createdAt: Timestamp;
}

export interface Problem {
  id: string;
  title: string;
  link: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  solvedBy: string;
  notes: string;
  createdAt: Timestamp;
  comments: Comment[];
}

export interface Stats {
  totalProblems: number;
  byUser: {
    [key: string]: number;
  };
  byDifficulty: {
    Easy: number;
    Medium: number;
    Hard: number;
  };
  byTag: {
    [key: string]: number;
  };
  streak: number;
  solvedToday: number;
}

export interface LeetCodeProblem {
  questionId: string;
  title: string;
  titleSlug: string;
  difficulty: string;
  topicTags: Array<{ name: string }>;
}
