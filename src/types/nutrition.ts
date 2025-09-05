export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar?: number;
  sodium?: number;
}

export interface MacroDistribution {
  carbs: number;
  protein: number;
  fats: number;
}

export interface DailyNutrition {
  date: string;
  consumed: NutritionData;
  target: NutritionData;
  remaining: NutritionData;
  meals: MealEntry[];
  score: number; // 0-100 nutrition score
}

export interface MealEntry {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  description: string;
  time: string;
  nutrition: NutritionData;
  imageUrl?: string;
  createdAt: Date;
}

export interface NutritionTrend {
  date: string;
  calories: number;
  protein: number;
  score: number;
  weight?: number;
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  region: string;
  nutrition: NutritionData; // per 100g
  commonServing: number;
  unit: string;
}

export interface MealPlan {
  id: string;
  title: string;
  description: string;
  totalNutrition: NutritionData;
  meals: {
    breakfast: MealSuggestion[];
    lunch: MealSuggestion[];
    dinner: MealSuggestion[];
    snacks: MealSuggestion[];
  };
  createdAt: Date;
}

export interface MealSuggestion {
  name: string;
  description: string;
  nutrition: NutritionData;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  region: string;
}