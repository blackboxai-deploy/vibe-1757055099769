import { UserProfile, NutritionGoals, UserStats } from '@/types/user';
import { DailyNutrition, MealEntry, MealPlan, NutritionTrend } from '@/types/nutrition';

export class DataStorage {
  private static readonly STORAGE_KEYS = {
    USER_PROFILE: 'nutriai_user_profile',
    NUTRITION_GOALS: 'nutriai_nutrition_goals',
    DAILY_NUTRITION: 'nutriai_daily_nutrition',
    MEAL_PLANS: 'nutriai_meal_plans',
    USER_STATS: 'nutriai_user_stats',
    NUTRITION_TRENDS: 'nutriai_nutrition_trends'
  };

  /**
   * User Profile Management
   */
  static saveUserProfile(profile: UserProfile): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    }
  }

  static getUserProfile(): UserProfile | null {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(this.STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  static clearUserProfile(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEYS.USER_PROFILE);
    }
  }

  /**
   * Nutrition Goals Management
   */
  static saveNutritionGoals(goals: NutritionGoals): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEYS.NUTRITION_GOALS, JSON.stringify(goals));
    }
  }

  static getNutritionGoals(): NutritionGoals | null {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(this.STORAGE_KEYS.NUTRITION_GOALS);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  /**
   * Daily Nutrition Tracking
   */
  static saveDailyNutrition(date: string, nutrition: DailyNutrition): void {
    if (typeof window !== 'undefined') {
      const allData = this.getAllDailyNutrition();
      allData[date] = nutrition;
      localStorage.setItem(this.STORAGE_KEYS.DAILY_NUTRITION, JSON.stringify(allData));
    }
  }

  static getDailyNutrition(date: string): DailyNutrition | null {
    if (typeof window !== 'undefined') {
      const allData = this.getAllDailyNutrition();
      return allData[date] || null;
    }
    return null;
  }

  static getAllDailyNutrition(): { [date: string]: DailyNutrition } {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(this.STORAGE_KEYS.DAILY_NUTRITION);
      return data ? JSON.parse(data) : {};
    }
    return {};
  }

  /**
   * Meal Management
   */
  static addMealEntry(date: string, meal: MealEntry): void {
    const dailyNutrition = this.getDailyNutrition(date);
    if (dailyNutrition) {
      dailyNutrition.meals.push(meal);
      
      // Recalculate consumed nutrition
      dailyNutrition.consumed = dailyNutrition.meals.reduce(
        (total, mealEntry) => ({
          calories: total.calories + mealEntry.nutrition.calories,
          protein: total.protein + mealEntry.nutrition.protein,
          carbs: total.carbs + mealEntry.nutrition.carbs,
          fats: total.fats + mealEntry.nutrition.fats,
          fiber: total.fiber + mealEntry.nutrition.fiber,
          sugar: (total.sugar || 0) + (mealEntry.nutrition.sugar || 0),
          sodium: (total.sodium || 0) + (mealEntry.nutrition.sodium || 0)
        }),
        { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, sodium: 0 }
      );

      // Recalculate remaining
      dailyNutrition.remaining = {
        calories: Math.max(0, dailyNutrition.target.calories - dailyNutrition.consumed.calories),
        protein: Math.max(0, dailyNutrition.target.protein - dailyNutrition.consumed.protein),
        carbs: Math.max(0, dailyNutrition.target.carbs - dailyNutrition.consumed.carbs),
        fats: Math.max(0, dailyNutrition.target.fats - dailyNutrition.consumed.fats),
        fiber: Math.max(0, dailyNutrition.target.fiber - dailyNutrition.consumed.fiber),
        sugar: Math.max(0, (dailyNutrition.target.sugar || 0) - (dailyNutrition.consumed.sugar || 0)),
        sodium: Math.max(0, (dailyNutrition.target.sodium || 0) - (dailyNutrition.consumed.sodium || 0))
      };

      // Update nutrition score
      dailyNutrition.score = this.calculateNutritionScore(dailyNutrition.target, dailyNutrition.consumed);

      this.saveDailyNutrition(date, dailyNutrition);
    }
  }

  static removeMealEntry(date: string, mealId: string): void {
    const dailyNutrition = this.getDailyNutrition(date);
    if (dailyNutrition) {
      dailyNutrition.meals = dailyNutrition.meals.filter(meal => meal.id !== mealId);
      this.saveDailyNutrition(date, dailyNutrition);
    }
  }

  /**
   * Meal Plans Management
   */
  static saveMealPlan(mealPlan: MealPlan): void {
    if (typeof window !== 'undefined') {
      const allPlans = this.getAllMealPlans();
      allPlans[mealPlan.id] = mealPlan;
      localStorage.setItem(this.STORAGE_KEYS.MEAL_PLANS, JSON.stringify(allPlans));
    }
  }

  static getMealPlan(planId: string): MealPlan | null {
    if (typeof window !== 'undefined') {
      const allPlans = this.getAllMealPlans();
      return allPlans[planId] || null;
    }
    return null;
  }

  static getAllMealPlans(): { [id: string]: MealPlan } {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(this.STORAGE_KEYS.MEAL_PLANS);
      return data ? JSON.parse(data) : {};
    }
    return {};
  }

  static deleteMealPlan(planId: string): void {
    if (typeof window !== 'undefined') {
      const allPlans = this.getAllMealPlans();
      delete allPlans[planId];
      localStorage.setItem(this.STORAGE_KEYS.MEAL_PLANS, JSON.stringify(allPlans));
    }
  }

  /**
   * User Stats Management
   */
  static saveUserStats(stats: UserStats): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
    }
  }

  static getUserStats(): UserStats | null {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(this.STORAGE_KEYS.USER_STATS);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  /**
   * Nutrition Trends Management
   */
  static saveNutritionTrend(date: string, trend: NutritionTrend): void {
    if (typeof window !== 'undefined') {
      const allTrends = this.getAllNutritionTrends();
      allTrends[date] = trend;
      localStorage.setItem(this.STORAGE_KEYS.NUTRITION_TRENDS, JSON.stringify(allTrends));
    }
  }

  static getNutritionTrends(days: number = 7): NutritionTrend[] {
    if (typeof window !== 'undefined') {
      const allTrends = this.getAllNutritionTrends();
      const dates = Object.keys(allTrends).sort().slice(-days);
      return dates.map(date => allTrends[date]);
    }
    return [];
  }

  private static getAllNutritionTrends(): { [date: string]: NutritionTrend } {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(this.STORAGE_KEYS.NUTRITION_TRENDS);
      return data ? JSON.parse(data) : {};
    }
    return {};
  }

  /**
   * Initialize daily nutrition entry
   */
  static initializeDailyNutrition(date: string, target: NutritionGoals): DailyNutrition {
    const targetNutrition = {
      calories: target.calories,
      protein: target.protein,
      carbs: target.carbs,
      fats: target.fats,
      fiber: target.fiber
    };

    const dailyNutrition: DailyNutrition = {
      date,
      consumed: { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 },
      target: targetNutrition,
      remaining: targetNutrition,
      meals: [],
      score: 0
    };

    this.saveDailyNutrition(date, dailyNutrition);
    return dailyNutrition;
  }

  /**
   * Export all data for backup
   */
  static exportAllData(): string {
    if (typeof window !== 'undefined') {
      const allData = {
        profile: this.getUserProfile(),
        goals: this.getNutritionGoals(),
        dailyNutrition: this.getAllDailyNutrition(),
        mealPlans: this.getAllMealPlans(),
        stats: this.getUserStats(),
        trends: this.getAllNutritionTrends(),
        exportDate: new Date().toISOString()
      };
      return JSON.stringify(allData, null, 2);
    }
    return '{}';
  }

  /**
   * Import data from backup
   */
  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.profile) this.saveUserProfile(data.profile);
      if (data.goals) this.saveNutritionGoals(data.goals);
      if (data.dailyNutrition) {
        localStorage.setItem(this.STORAGE_KEYS.DAILY_NUTRITION, JSON.stringify(data.dailyNutrition));
      }
      if (data.mealPlans) {
        localStorage.setItem(this.STORAGE_KEYS.MEAL_PLANS, JSON.stringify(data.mealPlans));
      }
      if (data.stats) this.saveUserStats(data.stats);
      if (data.trends) {
        localStorage.setItem(this.STORAGE_KEYS.NUTRITION_TRENDS, JSON.stringify(data.trends));
      }

      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  /**
   * Clear all data
   */
  static clearAllData(): void {
    if (typeof window !== 'undefined') {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    }
  }

  /**
   * Calculate nutrition score helper
   */
  private static calculateNutritionScore(target: any, consumed: any): number {
    // Simple scoring algorithm
    const calorieRatio = consumed.calories / target.calories;
    const proteinRatio = consumed.protein / target.protein;
    
    const calorieScore = calorieRatio >= 0.8 && calorieRatio <= 1.2 ? 100 : Math.max(0, 100 - Math.abs(calorieRatio - 1) * 100);
    const proteinScore = Math.min(100, proteinRatio * 100);
    
    return Math.round((calorieScore + proteinScore) / 2);
  }
}