export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  activityLevel: 'low' | 'moderate' | 'high';
  goal: 'weight_loss' | 'weight_gain' | 'balanced_diet';
  dietPreference: 'vegetarian' | 'non_vegetarian' | 'vegan';
  region: string; // Indian cuisine region
  healthIssues: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  bmr: number;
  tdee: number;
}

export interface UserStats {
  currentWeight: number;
  targetWeight?: number;
  weightHistory: WeightEntry[];
  nutritionStreak: number;
  goalsAchieved: number;
}

export interface WeightEntry {
  date: string;
  weight: number;
  notes?: string;
}