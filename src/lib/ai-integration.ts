import { UserProfile, NutritionGoals } from '@/types/user';
import { MealPlan, NutritionData } from '@/types/nutrition';

export class AIService {
  private static readonly API_ENDPOINT = 'https://oi-server.onrender.com/chat/completions';
  private static readonly HEADERS = {
    'CustomerId': 'poojams2602@gmail.com',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer xxx'
  };

  /**
   * Generate personalized meal plan using AI
   */
  static async generateMealPlan(user: UserProfile, goals: NutritionGoals): Promise<MealPlan> {
    const prompt = this.buildMealPlanPrompt(user, goals);
    
    try {
      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: this.HEADERS,
        body: JSON.stringify({
          model: 'openrouter/anthropic/claude-sonnet-4',
          messages: [
            {
              role: 'system',
              content: 'You are NutriAI, an expert Indian dietician. Create detailed, culturally appropriate meal plans with accurate nutrition estimates for Indian foods. Always respond in valid JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;
      
      return this.parseMealPlanResponse(aiResponse);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      return this.getDefaultMealPlan(user, goals);
    }
  }

  /**
   * Analyze nutrition content of meals using AI
   */
  static async analyzeMealNutrition(mealDescription: string): Promise<NutritionData> {
    const prompt = `Analyze the nutritional content of this Indian meal: "${mealDescription}".

Provide accurate estimates in JSON format:
{
  "calories": number,
  "protein": number (grams),
  "carbs": number (grams), 
  "fats": number (grams),
  "fiber": number (grams)
}

Consider typical Indian cooking methods and portion sizes. Be realistic with estimates.`;

    try {
      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: this.HEADERS,
        body: JSON.stringify({
          model: 'openrouter/anthropic/claude-sonnet-4',
          messages: [
            {
              role: 'system',
              content: 'You are a nutrition expert specializing in Indian foods. Provide accurate nutritional analysis in JSON format only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;
      
      return this.parseNutritionResponse(aiResponse);
    } catch (error) {
      console.error('Error analyzing nutrition:', error);
      return this.getDefaultNutrition();
    }
  }

  /**
   * Get exercise recommendations based on user profile
   */
  static async getExerciseRecommendations(user: UserProfile): Promise<string[]> {
    const prompt = `Suggest 5 suitable exercises/yoga practices for:
- Age: ${user.age}, Gender: ${user.gender}
- Goal: ${user.goal.replace('_', ' ')}
- Activity Level: ${user.activityLevel}
- Health Issues: ${user.healthIssues.join(', ') || 'None'}

Focus on exercises suitable for Indian home environment, including yoga. Provide as simple bullet points.`;

    try {
      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: this.HEADERS,
        body: JSON.stringify({
          model: 'openrouter/anthropic/claude-sonnet-4',
          messages: [
            {
              role: 'system',
              content: 'You are a fitness expert specializing in Indian exercise traditions and home workouts. Provide practical recommendations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;
      
      return this.parseExerciseResponse(aiResponse);
    } catch (error) {
      console.error('Error getting exercise recommendations:', error);
      return this.getDefaultExercises();
    }
  }

  /**
   * Build comprehensive meal plan prompt
   */
  private static buildMealPlanPrompt(user: UserProfile, goals: NutritionGoals): string {
    const healthContext = user.healthIssues.length > 0 ? `Health considerations: ${user.healthIssues.join(', ')}` : '';
    const ageContext = user.age > 50 ? 'Focus on easy-to-digest foods.' : '';
    
    return `Create a personalized full-day Indian meal plan for:

USER PROFILE:
- Name: ${user.name}, Age: ${user.age}, Gender: ${user.gender}
- Goal: ${user.goal.replace('_', ' ')}
- Diet: ${user.dietPreference} 
- Region: ${user.region}
- ${healthContext}
- ${ageContext}

NUTRITION TARGETS:
- Calories: ${goals.calories} kcal
- Protein: ${goals.protein}g
- Carbs: ${goals.carbs}g
- Fats: ${goals.fats}g

Provide response in this JSON format:
{
  "title": "Personalized meal plan title",
  "description": "Brief description",
  "meals": {
    "breakfast": [{"name": "Dish name", "description": "Description", "calories": 300, "protein": 15}],
    "lunch": [{"name": "Dish name", "description": "Description", "calories": 400, "protein": 20}],
    "dinner": [{"name": "Dish name", "description": "Description", "calories": 350, "protein": 18}],
    "snacks": [{"name": "Snack name", "description": "Description", "calories": 150, "protein": 8}]
  }
}

Focus on traditional Indian foods that match the user's dietary preferences and regional cuisine.`;
  }

  /**
   * Parse AI meal plan response
   */
  private static parseMealPlanResponse(aiResponse: string): MealPlan {
    try {
      const cleanResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleanResponse);
      
      return {
        id: Date.now().toString(),
        title: parsed.title || 'Personalized Meal Plan',
        description: parsed.description || 'AI-generated meal plan',
        totalNutrition: this.calculateTotalNutrition(parsed.meals),
        meals: parsed.meals,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error parsing meal plan:', error);
      throw new Error('Invalid meal plan response from AI');
    }
  }

  /**
   * Parse nutrition analysis response
   */
  private static parseNutritionResponse(aiResponse: string): NutritionData {
    try {
      const cleanResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleanResponse);
      
      return {
        calories: parsed.calories || 0,
        protein: parsed.protein || 0,
        carbs: parsed.carbs || 0,
        fats: parsed.fats || 0,
        fiber: parsed.fiber || 0
      };
    } catch (error) {
      console.error('Error parsing nutrition:', error);
      return this.getDefaultNutrition();
    }
  }

  /**
   * Parse exercise recommendations
   */
  private static parseExerciseResponse(aiResponse: string): string[] {
    try {
      const lines = aiResponse.split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().match(/^\d+\./))
        .map(line => line.replace(/^[-•\d.]\s*/, '').trim())
        .filter(line => line.length > 0);
      
      return lines.length > 0 ? lines : this.getDefaultExercises();
    } catch (error) {
      console.error('Error parsing exercises:', error);
      return this.getDefaultExercises();
    }
  }

  /**
   * Calculate total nutrition from meal plan
   */
  private static calculateTotalNutrition(meals: any): NutritionData {
    let total = { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 };
    
    Object.values(meals).forEach((mealArray: any) => {
      mealArray.forEach((meal: any) => {
        total.calories += meal.calories || 0;
        total.protein += meal.protein || 0;
        total.carbs += meal.carbs || 0;
        total.fats += meal.fats || 0;
        total.fiber += meal.fiber || 0;
      });
    });
    
    return total;
  }

  /**
   * Default fallback meal plan
   */
  private static getDefaultMealPlan(user: UserProfile, goals: NutritionGoals): MealPlan {
    return {
      id: Date.now().toString(),
      title: 'Balanced Indian Meal Plan',
      description: 'Traditional Indian meal plan focusing on balanced nutrition',
      totalNutrition: {
        calories: goals.calories,
        protein: goals.protein,
        carbs: goals.carbs,
        fats: goals.fats,
        fiber: goals.fiber
      },
      meals: {
        breakfast: [{
          name: 'Poha with Vegetables',
          description: 'Traditional flattened rice with vegetables and spices',
          nutrition: { calories: 300, protein: 8, carbs: 55, fats: 6, fiber: 4 },
          ingredients: ['Poha', 'Onions', 'Peas', 'Turmeric', 'Lemon'],
          instructions: ['Rinse poha', 'Sauté vegetables', 'Mix with spices'],
          prepTime: 15,
          region: user.region
        }],
        lunch: [{
          name: 'Dal Rice with Vegetables',
          description: 'Complete protein combination with seasonal vegetables',
          nutrition: { calories: 450, protein: 18, carbs: 75, fats: 8, fiber: 12 },
          ingredients: ['Toor dal', 'Rice', 'Mixed vegetables', 'Spices'],
          instructions: ['Cook dal and rice', 'Prepare vegetable curry'],
          prepTime: 30,
          region: user.region
        }],
        dinner: [{
          name: 'Roti with Sabzi',
          description: 'Whole wheat bread with seasonal vegetable curry',
          nutrition: { calories: 350, protein: 12, carbs: 60, fats: 8, fiber: 10 },
          ingredients: ['Whole wheat flour', 'Seasonal vegetables', 'Oil', 'Spices'],
          instructions: ['Make roti dough', 'Prepare vegetable curry'],
          prepTime: 25,
          region: user.region
        }],
        snacks: [{
          name: 'Roasted Chana',
          description: 'Protein-rich roasted chickpeas with spices',
          nutrition: { calories: 150, protein: 8, carbs: 20, fats: 3, fiber: 6 },
          ingredients: ['Roasted chickpeas', 'Chaat masala', 'Lemon'],
          instructions: ['Season roasted chana with spices'],
          prepTime: 5,
          region: user.region
        }]
      },
      createdAt: new Date()
    };
  }

  /**
   * Default nutrition values for fallback
   */
  private static getDefaultNutrition(): NutritionData {
    return {
      calories: 250,
      protein: 10,
      carbs: 35,
      fats: 8,
      fiber: 5
    };
  }

  /**
   * Default exercise recommendations
   */
  private static getDefaultExercises(): string[] {
    return [
      'Surya Namaskara (Sun Salutation) - 10 rounds',
      'Brisk walking - 30 minutes',
      'Pranayama breathing exercises - 10 minutes',
      'Basic strength training - 20 minutes',
      'Yoga asanas for flexibility - 15 minutes'
    ];
  }
}