"use client";

import { useState, useEffect } from 'react';
import { CalorieRingChart } from '@/components/charts/CalorieRingChart';
import { ProteinProgressBar } from '@/components/charts/ProteinProgressBar';
import { MacroDistributionChart } from '@/components/charts/MacroDistributionChart';
import { NutritionTrendChart } from '@/components/charts/NutritionTrendChart';
import { MealTimelineChart } from '@/components/charts/MealTimelineChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataStorage } from '@/lib/data-storage';
import { UserProfile, NutritionGoals } from '@/types/user';
import { DailyNutrition, NutritionTrend } from '@/types/nutrition';
import { NutritionCalculator } from '@/lib/nutrition-calculator';

interface NutritionDashboardProps {
  className?: string;
}

export function NutritionDashboard({ className }: NutritionDashboardProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [goals, setGoals] = useState<NutritionGoals | null>(null);
  const [todayNutrition, setTodayNutrition] = useState<DailyNutrition | null>(null);
  const [weeklyTrends, setWeeklyTrends] = useState<NutritionTrend[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      const userProfile = DataStorage.getUserProfile();
      const nutritionGoals = DataStorage.getNutritionGoals();
      
      if (userProfile && nutritionGoals) {
        setUser(userProfile);
        setGoals(nutritionGoals);
        
        // Load today's nutrition or create new entry
        let dailyNutrition = DataStorage.getDailyNutrition(today);
        if (!dailyNutrition) {
          dailyNutrition = DataStorage.initializeDailyNutrition(today, nutritionGoals);
        }
        setTodayNutrition(dailyNutrition);
        
        // Load weekly trends
        const trends = DataStorage.getNutritionTrends(7);
        setWeeklyTrends(trends);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadUserData();
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your nutrition dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !goals || !todayNutrition) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">
            Welcome to NutriAI! 🙏
          </h3>
          <p className="text-orange-700 mb-4">
            Complete your profile setup to see your personalized nutrition dashboard with interactive charts and insights.
          </p>
          <button
            onClick={() => window.location.href = '/register'}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Complete Setup
          </button>
        </div>
      </div>
    );
  }

  // Calculate nutrition score and status
  const nutritionScore = NutritionCalculator.calculateNutritionScore(
    todayNutrition.target,
    todayNutrition.consumed
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    if (score >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with user greeting and score */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Namaste, {user.name}! 🙏
        </h1>
        <p className="text-gray-600 mb-4">
          Your personalized nutrition dashboard with AI-powered insights
        </p>
        <div className={`inline-flex items-center px-4 py-2 rounded-full ${getScoreColor(nutritionScore)}`}>
          <span className="text-lg font-bold mr-2">Today&apos;s Score: {nutritionScore}/100</span>
          <span className="text-sm">
            {nutritionScore >= 80 ? '🎉 Excellent!' : 
             nutritionScore >= 60 ? '👍 Good!' : 
             nutritionScore >= 40 ? '📈 Improving' : '💪 Let&apos;s go!'}
          </span>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Calorie Ring Chart */}
        <CalorieRingChart
          consumed={todayNutrition.consumed.calories}
          target={todayNutrition.target.calories}
          className="col-span-1"
        />

        {/* Protein Progress Bar */}
        <ProteinProgressBar
          consumed={todayNutrition.consumed.protein}
          target={todayNutrition.target.protein}
          className="col-span-1"
        />
      </div>

      {/* Macro Distribution Chart */}
      <MacroDistributionChart
        consumed={{
          carbs: todayNutrition.consumed.carbs,
          protein: todayNutrition.consumed.protein,
          fats: todayNutrition.consumed.fats
        }}
        target={{
          carbs: todayNutrition.target.carbs,
          protein: todayNutrition.target.protein,
          fats: todayNutrition.target.fats
        }}
        className="mb-6"
      />

      {/* Meal Timeline Chart */}
      <MealTimelineChart
        meals={todayNutrition.meals}
        className="mb-6"
      />

      {/* Nutrition Trends Chart */}
      {weeklyTrends.length >= 2 && (
        <NutritionTrendChart
          data={weeklyTrends}
          calorieTarget={goals.calories}
          proteinTarget={goals.protein}
          className="mb-6"
        />
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">🍽️</div>
            <h3 className="font-semibold text-gray-800 mb-1">Log Meal</h3>
            <p className="text-sm text-gray-600">Add your meals and track nutrition</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">🧠</div>
            <h3 className="font-semibold text-gray-800 mb-1">AI Meal Plan</h3>
            <p className="text-sm text-gray-600">Get personalized Indian meal suggestions</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-800 mb-1">Full Report</h3>
            <p className="text-sm text-gray-600">Download detailed nutrition analysis</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Summary Stats */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50">
        <CardHeader>
          <CardTitle className="text-center text-gray-800">Today&apos;s Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {todayNutrition.consumed.calories}
              </div>
              <div className="text-sm text-gray-600">Calories Consumed</div>
              <div className="text-xs text-gray-500">
                {todayNutrition.remaining.calories} remaining
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {todayNutrition.consumed.protein}g
              </div>
              <div className="text-sm text-gray-600">Protein Intake</div>
              <div className="text-xs text-gray-500">
                {todayNutrition.remaining.protein}g remaining
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {todayNutrition.meals.length}
              </div>
              <div className="text-sm text-gray-600">Meals Logged</div>
              <div className="text-xs text-gray-500">Today</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {goals.bmr}
              </div>
              <div className="text-sm text-gray-600">BMR</div>
              <div className="text-xs text-gray-500">Base metabolic rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refresh Data Button */}
      <div className="text-center">
        <button
          onClick={refreshData}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Refresh Dashboard
        </button>
      </div>
    </div>
  );
}