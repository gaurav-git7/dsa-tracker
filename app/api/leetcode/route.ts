import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    // Extract slug from URL
    const slug = url.split('/problems/')[1]?.split('/')[0];
    if (!slug) {
      return NextResponse.json(
        { error: 'Invalid LeetCode URL' },
        { status: 400 }
      );
    }

    // GraphQL query
    const query = `
      query getQuestionDetail($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          questionId
          title
          titleSlug
          difficulty
          topicTags {
            name
          }
        }
      }
    `;

    // Fetch from server-side (bypasses CORS)
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({
        query,
        variables: { titleSlug: slug },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from LeetCode');
    }

    const data = await response.json();
    
    if (!data.data?.question) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      title: data.data.question.title,
      difficulty: data.data.question.difficulty,
      tags: data.data.question.topicTags.map((tag: any) => tag.name),
    });
  } catch (error) {
    console.error('Error fetching LeetCode problem:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problem details' },
      { status: 500 }
    );
  }
}
