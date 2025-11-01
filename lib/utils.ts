import { Problem } from './types';

/**
 * Export problems data to CSV format
 */
export function exportToCSV(problems: Problem[]): void {
  if (problems.length === 0) {
    alert('No problems to export!');
    return;
  }

  // CSV headers
  const headers = ['Title', 'Link', 'Difficulty', 'Tags', 'Solved By', 'Notes', 'Date'];
  
  // Convert problems to CSV rows
  const rows = problems.map(problem => [
    problem.title,
    problem.link,
    problem.difficulty,
    problem.tags.join('; '),
    problem.solvedBy,
    problem.notes.replace(/,/g, ';'), // Replace commas to avoid CSV issues
    problem.createdAt.toDate().toLocaleDateString(),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `dsa-progress-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Calculate streak (consecutive days with at least one problem solved)
 */
export function calculateStreak(problems: Problem[]): number {
  if (problems.length === 0) return 0;

  // Sort problems by date (newest first)
  const sortedProblems = [...problems].sort((a, b) => 
    b.createdAt.toMillis() - a.createdAt.toMillis()
  );

  // Get unique dates
  const uniqueDates = new Set(
    sortedProblems.map(p => 
      p.createdAt.toDate().toDateString()
    )
  );

  const dates = Array.from(uniqueDates).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  let streak = 0;
  const today = new Date().toDateString();
  
  // Check if there's activity today or yesterday (to not break streak)
  const lastDate = dates[0];
  const daysDiff = Math.floor(
    (new Date(today).getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysDiff > 1) return 0; // Streak broken

  // Count consecutive days
  for (let i = 0; i < dates.length - 1; i++) {
    const current = new Date(dates[i]);
    const next = new Date(dates[i + 1]);
    const diff = Math.floor(
      (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak + 1; // +1 for the current day
}

/**
 * Count problems solved today
 */
export function countSolvedToday(problems: Problem[]): number {
  const today = new Date().toDateString();
  return problems.filter(p => 
    p.createdAt.toDate().toDateString() === today
  ).length;
}

/**
 * Format date for display
 */
export function formatDate(timestamp: any): string {
  const date = timestamp.toDate();
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}
