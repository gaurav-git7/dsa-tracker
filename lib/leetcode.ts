/**
 * Fetch LeetCode problem metadata from the problem URL
 * This uses our API route to bypass CORS issues
 */
export async function fetchLeetCodeProblem(url: string) {
  try {
    // Call our API route instead of directly calling LeetCode
    const response = await fetch('/api/leetcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch from LeetCode');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching LeetCode problem:', error);
    throw error;
  }
}

/**
 * Validate if a URL is a valid LeetCode problem URL
 */
export function isValidLeetCodeUrl(url: string): boolean {
  const leetcodePattern = /^https?:\/\/(www\.)?leetcode\.com\/problems\/[\w-]+\/?/;
  return leetcodePattern.test(url);
}
