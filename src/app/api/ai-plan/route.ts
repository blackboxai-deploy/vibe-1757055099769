import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai-integration';
import { UserProfile, NutritionGoals } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userProfile, nutritionGoals } = body;

    if (!userProfile || !nutritionGoals) {
      return NextResponse.json(
        { error: 'User profile and nutrition goals are required' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!userProfile.name || !userProfile.age || !userProfile.dietPreference) {
      return NextResponse.json(
        { error: 'Missing required user profile fields (name, age, dietPreference)' },
        { status: 400 }
      );
    }

    if (!nutritionGoals.calories || !nutritionGoals.protein) {
      return NextResponse.json(
        { error: 'Missing required nutrition goals (calories, protein)' },
        { status: 400 }
      );
    }

    // Generate meal plan using AI
    const mealPlan = await AIService.generateMealPlan(
      userProfile as UserProfile,
      nutritionGoals as NutritionGoals
    );

    return NextResponse.json({
      success: true,
      mealPlan: mealPlan
    });
  } catch (error) {
    console.error('Error generating meal plan:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate meal plan. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Meal Plan generation API endpoint',
    usage: 'POST with { userProfile: UserProfile, nutritionGoals: NutritionGoals }',
    example: {
      userProfile: {
        name: 'John Doe',
        age: 30,
        gender: 'male',
        dietPreference: 'vegetarian',
        region: 'north_indian',
        goal: 'weight_loss',
        healthIssues: []
      },
      nutritionGoals: {
        calories: 2000,
        protein: 80,
        carbs: 250,
        fats: 67
      }
    }
  });
}