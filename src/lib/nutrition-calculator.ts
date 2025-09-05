import { UserProfile, NutritionGoals } from '@/types/user';
import { NutritionData } from '@/types/nutrition';

export class NutritionCalculator {
  /**
   * Calculate BMR using Mifflin-St Jeor Equation
   */
  static calculateBMR(user: UserProfile): number {
    const { weight, height, age, gender } = user;
    
    // BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + s
    // s = +5 for males, -161 for females
    const baseBMR = 10 * weight + 6.25 * height - 5 * age;
    const genderFactor = gender === 'female' ? -161 : 5;
    
    return Math.round(baseBMR + genderFactor);
  }

  /**
   * Calculate TDEE (Total Daily Energy Expenditure)
   */
  static calculateTDEE(bmr: number, activityLevel: string): number {
    const activityFactors = {
      'low': 1.2,       // Sedentary
      'moderate': 1.55, // Moderately active
      'high': 1.725     // Very active
    };
    
    const factor = activityFactors[activityLevel as keyof typeof activityFactors] || 1.2;
    return Math.round(bmr * factor);
  }

  /**
   * Calculate complete nutrition goals based on user profile
   */
  static calculateNutritionGoals(user: UserProfile): NutritionGoals {
    const bmr = this.calculateBMR(user);
    const tdee = this.calculateTDEE(bmr, user.activityLevel);
    
    // Adjust calories based on goal
    let targetCalories = tdee;
    if (user.goal === 'weight_loss') {
      targetCalories = Math.round(tdee * 0.85); // 15% deficit
    } else if (user.goal === 'weight_gain') {
      targetCalories = Math.round(tdee * 1.15); // 15% surplus
    }

    // Calculate macros - Indian diet considerations
    const proteinRatio = user.dietPreference === 'non_vegetarian' ? 0.25 : 0.20;
    const carbRatio = user.dietPreference === 'vegetarian' ? 0.60 : 0.50;
    const fatRatio = 1 - proteinRatio - carbRatio;

    return {
      calories: targetCalories,
      protein: Math.round((targetCalories * proteinRatio) / 4), // 4 cal/g
      carbs: Math.round((targetCalories * carbRatio) / 4), // 4 cal/g
      fats: Math.round((targetCalories * fatRatio) / 9), // 9 cal/g
      fiber: Math.round(user.age < 50 ? 25 + (user.gender === 'male' ? 13 : 0) : 21 + (user.gender === 'male' ? 9 : 0)),
      bmr,
      tdee
    };
  }

  /**
   * Calculate remaining nutrition for the day
   */
  static calculateRemaining(target: NutritionData, consumed: NutritionData): NutritionData {
    return {
      calories: Math.max(0, target.calories - consumed.calories),
      protein: Math.max(0, target.protein - consumed.protein),
      carbs: Math.max(0, target.carbs - consumed.carbs),
      fats: Math.max(0, target.fats - consumed.fats),
      fiber: Math.max(0, target.fiber - consumed.fiber),
      sugar: target.sugar ? Math.max(0, target.sugar - (consumed.sugar || 0)) : 0,
      sodium: target.sodium ? Math.max(0, target.sodium - (consumed.sodium || 0)) : 0
    };
  }

  /**
   * Calculate nutrition score (0-100) based on goals vs consumption
   */
  static calculateNutritionScore(target: NutritionData, consumed: NutritionData): number {
    const scores = [];
    
    // Calorie score (penalty for both over and under)
    const calorieRatio = consumed.calories / target.calories;
    const calorieScore = calorieRatio >= 0.85 && calorieRatio <= 1.15 ? 100 : 
                        Math.max(0, 100 - Math.abs(calorieRatio - 1) * 100);
    scores.push(calorieScore);

    // Protein score (important for Indian diets)
    const proteinRatio = consumed.protein / target.protein;
    const proteinScore = Math.min(100, proteinRatio * 100);
    scores.push(proteinScore * 1.2); // Weighted higher

    // Carb score
    const carbRatio = consumed.carbs / target.carbs;
    const carbScore = carbRatio >= 0.8 && carbRatio <= 1.2 ? 100 :
                     Math.max(0, 100 - Math.abs(carbRatio - 1) * 50);
    scores.push(carbScore);

    // Fat score
    const fatRatio = consumed.fats / target.fats;
    const fatScore = fatRatio >= 0.7 && fatRatio <= 1.3 ? 100 :
                    Math.max(0, 100 - Math.abs(fatRatio - 1) * 60);
    scores.push(fatScore);

    // Fiber score
    const fiberRatio = consumed.fiber / target.fiber;
    const fiberScore = Math.min(100, fiberRatio * 100);
    scores.push(fiberScore);

    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }

  /**
   * Get personalized recommendations based on remaining nutrition
   */
  static getRecommendations(remaining: NutritionData, user: UserProfile): string[] {
    const recommendations: string[] = [];
    
    if (remaining.protein > 15) {
      const proteinFoods = user.dietPreference === 'vegetarian' 
        ? ['dal', 'paneer', 'yogurt', 'nuts']
        : ['chicken', 'fish', 'eggs', 'dal'];
      recommendations.push(`Add ${remaining.protein}g protein: Try ${proteinFoods.join(', ')}`);
    }

    if (remaining.calories > 200) {
      recommendations.push(`${remaining.calories} calories remaining - consider a healthy snack`);
    }

    if (remaining.fiber > 10) {
      recommendations.push(`Increase fiber intake: Add vegetables, fruits, or whole grains`);
    }

    if (remaining.calories < -200) {
      recommendations.push(`You've exceeded daily calories by ${Math.abs(remaining.calories)} - consider lighter meals tomorrow`);
    }

    return recommendations;
  }
}