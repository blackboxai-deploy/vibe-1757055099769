import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai-integration';
import { UserProfile } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userProfile } = body;

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!userProfile.age || !userProfile.gender || !userProfile.goal) {
      return NextResponse.json(
        { error: 'Missing required user profile fields (age, gender, goal)' },
        { status: 400 }
      );
    }

    // Get exercise recommendations using AI
    const exercises = await AIService.getExerciseRecommendations(userProfile as UserProfile);

    return NextResponse.json({
      success: true,
      exercises: exercises
    });
  } catch (error) {
    console.error('Error getting exercise recommendations:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get exercise recommendations. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Exercise recommendations API endpoint',
    usage: 'POST with { userProfile: UserProfile }',
    example: {
      userProfile: {
        name: 'John Doe',
        age: 30,
        gender: 'male',
        goal: 'weight_loss',
        activityLevel: 'moderate',
        healthIssues: ['back_pain']
      }
    }
  });
}