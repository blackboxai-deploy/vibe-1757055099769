import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai-integration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mealDescription } = body;

    if (!mealDescription || typeof mealDescription !== 'string') {
      return NextResponse.json(
        { error: 'Meal description is required and must be a string' },
        { status: 400 }
      );
    }

    // Analyze nutrition using AI
    const nutritionData = await AIService.analyzeMealNutrition(mealDescription);

    return NextResponse.json({
      success: true,
      nutrition: nutritionData
    });
  } catch (error) {
    console.error('Error analyzing nutrition:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze nutrition. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Nutrition analysis API endpoint',
    usage: 'POST with { mealDescription: string }',
    example: {
      mealDescription: '2 roti with dal tadka and mixed vegetables'
    }
  });
}