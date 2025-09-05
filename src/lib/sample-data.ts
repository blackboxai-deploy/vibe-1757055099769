import { UserProfile, NutritionGoals } from '@/types/user';
import { MealEntry, NutritionTrend, MealPlan } from '@/types/nutrition';
import { DataStorage } from './data-storage';

export class SampleDataGenerator {
  /**
   * Generate sample data for demo purposes
   */
  static generateSampleData(): void {
    // Create sample user profile
    const sampleUser: UserProfile = {
      id: 'sample_user_001',
      name: 'Priya Sharma',
      age: 28,
      gender: 'female',
      height: 160,
      weight: 65,
      activityLevel: 'moderate',
      goal: 'weight_loss',
      dietPreference: 'vegetarian',
      region: 'north_indian',
      healthIssues: ['PCOS'],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Create sample nutrition goals
    const sampleGoals: NutritionGoals = {
      calories: 1800,
      protein: 90,
      carbs: 200,
      fats: 60,
      fiber: 25,
      bmr: 1350,
      tdee: 2100
    };

    // Save sample data
    DataStorage.saveUserProfile(sampleUser);
    DataStorage.saveNutritionGoals(sampleGoals);

    // Generate sample meals for today
    this.generateSampleMeals();

    // Generate sample nutrition trends
    this.generateSampleTrends();

    console.log('Sample data generated successfully!');
  }

  /**
   * Generate sample meals for today
   */
  private static generateSampleMeals(): void {
    const today = new Date().toISOString().split('T')[0];
    const goals = DataStorage.getNutritionGoals();
    
    if (!goals) return;

    DataStorage.initializeDailyNutrition(today, goals);

    // Sample breakfast
    const breakfast: MealEntry = {
      id: 'meal_001',
      type: 'breakfast',
      name: 'Poha with Vegetables',
      description: 'Flattened rice with onions, peas, and curry leaves',
      time: '08:00',
      nutrition: {
        calories: 280,
        protein: 6,
        carbs: 52,
        fats: 5,
        fiber: 4
      },
      createdAt: new Date()
    };

    // Sample lunch
    const lunch: MealEntry = {
      id: 'meal_002',
      type: 'lunch',
      name: 'Dal Rice with Mixed Vegetables',
      description: 'Toor dal, basmati rice, and seasonal vegetable curry',
      time: '13:00',
      nutrition: {
        calories: 520,
        protein: 22,
        carbs: 85,
        fats: 8,
        fiber: 12
      },
      createdAt: new Date()
    };

    // Sample snack
    const snack: MealEntry = {
      id: 'meal_003',
      type: 'snack',
      name: 'Masala Chai with Biscuits',
      description: 'Traditional Indian tea with 2 digestive biscuits',
      time: '16:30',
      nutrition: {
        calories: 150,
        protein: 3,
        carbs: 25,
        fats: 4,
        fiber: 1
      },
      createdAt: new Date()
    };

    // Sample dinner
    const dinner: MealEntry = {
      id: 'meal_004',
      type: 'dinner',
      name: 'Roti with Paneer Curry',
      description: '2 whole wheat rotis with paneer makhani and salad',
      time: '20:00',
      nutrition: {
        calories: 480,
        protein: 25,
        carbs: 45,
        fats: 22,
        fiber: 8
      },
      createdAt: new Date()
    };

    // Add meals to daily nutrition
    [breakfast, lunch, snack, dinner].forEach(meal => {
      DataStorage.addMealEntry(today, meal);
    });
  }

  /**
   * Generate sample nutrition trends for the past 7 days
   */
  private static generateSampleTrends(): void {
    const trends: NutritionTrend[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Generate realistic trend data
      const baseCalories = 1600 + Math.random() * 400; // 1600-2000
      const baseProtein = 70 + Math.random() * 40; // 70-110g
      const score = Math.round(75 + Math.random() * 25); // 75-100
      
      trends.push({
        date: dateStr,
        calories: Math.round(baseCalories),
        protein: Math.round(baseProtein),
        score,
        weight: i === 0 ? 65 : 65.5 - (i * 0.1) // Slight weight loss trend
      });
    }

    // Save trends
    trends.forEach(trend => {
      DataStorage.saveNutritionTrend(trend.date, trend);
    });
  }

  /**
   * Generate sample meal plan
   */
  static generateSampleMealPlan(): MealPlan {
    return {
      id: 'plan_001',
      title: 'Balanced North Indian Vegetarian Plan',
      description: 'A well-balanced meal plan featuring traditional North Indian vegetarian dishes',
      totalNutrition: {
        calories: 1800,
        protein: 85,
        carbs: 220,
        fats: 65,
        fiber: 30
      },
      meals: {
        breakfast: [{
          name: 'Vegetable Upma',
          description: 'Semolina cooked with mixed vegetables and spices',
          nutrition: { calories: 320, protein: 8, carbs: 55, fats: 8, fiber: 5 },
          ingredients: ['Semolina', 'Mixed vegetables', 'Mustard seeds', 'Curry leaves'],
          instructions: ['Heat oil', 'Add mustard seeds', 'Add vegetables', 'Add semolina and water'],
          prepTime: 20,
          region: 'south_indian'
        }],
        lunch: [{
          name: 'Rajma Chawal',
          description: 'Kidney beans curry with basmati rice',
          nutrition: { calories: 580, protein: 25, carbs: 95, fats: 12, fiber: 15 },
          ingredients: ['Kidney beans', 'Basmati rice', 'Onions', 'Tomatoes', 'Spices'],
          instructions: ['Soak and cook rajma', 'Prepare masala', 'Combine and simmer', 'Serve with rice'],
          prepTime: 45,
          region: 'north_indian'
        }],
        dinner: [{
          name: 'Palak Paneer with Roti',
          description: 'Spinach curry with cottage cheese and whole wheat bread',
          nutrition: { calories: 450, protein: 22, carbs: 35, fats: 25, fiber: 8 },
          ingredients: ['Fresh spinach', 'Paneer', 'Whole wheat flour', 'Spices'],
          instructions: ['Blanch spinach', 'Make paneer curry', 'Prepare rotis', 'Serve hot'],
          prepTime: 35,
          region: 'north_indian'
        }],
        snacks: [{
          name: 'Mixed Nuts and Fruits',
          description: 'Seasonal fruits with almonds and walnuts',
          nutrition: { calories: 200, protein: 8, carbs: 20, fats: 12, fiber: 4 },
          ingredients: ['Almonds', 'Walnuts', 'Seasonal fruits', 'Honey'],
          instructions: ['Chop fruits', 'Mix with nuts', 'Drizzle honey if desired'],
          prepTime: 5,
          region: 'general'
        }]
      },
      createdAt: new Date()
    };
  }

  /**
   * Check if sample data exists
   */
  static hasSampleData(): boolean {
    const user = DataStorage.getUserProfile();
    return user?.id === 'sample_user_001';
  }

  /**
   * Clear sample data
   */
  static clearSampleData(): void {
    DataStorage.clearAllData();
    console.log('Sample data cleared!');
  }
}