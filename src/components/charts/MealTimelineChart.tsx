"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MealEntry } from '@/types/nutrition';

interface MealTimelineChartProps {
  meals: MealEntry[];
  className?: string;
}

export function MealTimelineChart({ meals, className }: MealTimelineChartProps) {
  // Group meals by type and calculate totals
  const mealGroups = meals.reduce((groups, meal) => {
    const type = meal.type;
    if (!groups[type]) {
      groups[type] = {
        type,
        meals: [],
        totalCalories: 0,
        totalProtein: 0,
        count: 0
      };
    }
    groups[type].meals.push(meal);
    groups[type].totalCalories += meal.nutrition.calories;
    groups[type].totalProtein += meal.nutrition.protein;
    groups[type].count += 1;
    return groups;
  }, {} as any);

  // Convert to chart data format
  const chartData = ['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => {
    const group = mealGroups[mealType] || { 
      type: mealType, 
      totalCalories: 0, 
      totalProtein: 0, 
      count: 0, 
      meals: [] 
    };
    
    return {
      name: mealType.charAt(0).toUpperCase() + mealType.slice(1),
      calories: group.totalCalories,
      protein: group.totalProtein,
      count: group.count,
      meals: group.meals,
      color: {
        'Breakfast': '#FF6B6B',
        'Lunch': '#4ECDC4', 
        'Dinner': '#45B7D1',
        'Snack': '#96CEB4'
      }[mealType.charAt(0).toUpperCase() + mealType.slice(1)] || '#9CA3AF'
    };
  });

  const totalCalories = chartData.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = chartData.reduce((sum, item) => sum + item.protein, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg max-w-xs">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p>Meals logged: {data.count}</p>
            <p>Total calories: {data.calories} kcal</p>
            <p>Total protein: {data.protein}g</p>
          </div>
          {data.meals.length > 0 && (
            <div className="mt-2 pt-2 border-t">
              <p className="text-xs font-medium text-gray-600 mb-1">Recent meals:</p>
              {data.meals.slice(0, 3).map((meal: MealEntry, index: number) => (
                <p key={index} className="text-xs text-gray-500 truncate">
                  • {meal.name}
                </p>
              ))}
              {data.meals.length > 3 && (
                <p className="text-xs text-gray-400">
                  +{data.meals.length - 3} more...
                </p>
              )}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ x, y, width, value }: any) => {
    if (value === 0) return null;
    return (
      <text
        x={x + width / 2}
        y={y - 5}
        fill="#374151"
        textAnchor="middle"
        fontSize={12}
        fontWeight="bold"
      >
        {value}
      </text>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-center">
          Daily Meal Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="flex justify-center space-x-8 text-center mb-4">
            <div>
              <div className="text-2xl font-bold text-gray-800">{totalCalories}</div>
              <div className="text-sm text-gray-500">Total Calories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{totalProtein}g</div>
              <div className="text-sm text-gray-500">Total Protein</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {meals.length}
              </div>
              <div className="text-sm text-gray-500">Meals Logged</div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 30,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  stroke="#666"
                />
                <YAxis 
                  fontSize={12}
                  stroke="#666"
                  label={{ value: 'Calories', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="calories" 
                  radius={[4, 4, 0, 0]}
                  label={<CustomLabel />}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Meal Distribution */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {chartData.map((meal, index) => (
              <div 
                key={index}
                className="text-center p-3 rounded-lg"
                style={{ backgroundColor: `${meal.color}20` }}
              >
                <div className="flex items-center justify-center mb-2">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: meal.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {meal.name}
                  </span>
                </div>
                <div className="text-lg font-bold" style={{ color: meal.color }}>
                  {meal.calories}
                </div>
                <div className="text-xs text-gray-500">
                  {meal.protein}g protein • {meal.count} meals
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations based on meal timing */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              Meal Timing Insights
            </h4>
            <div className="text-sm text-blue-700 space-y-1">
              {(() => {
                const insights = [];
                
                // Check breakfast
                const breakfast = chartData.find(m => m.name === 'Breakfast');
                if (!breakfast || breakfast.calories < 200) {
                  insights.push('🌅 Start your day with a nutritious breakfast (300-400 kcal)');
                } else if (breakfast.calories >= 300) {
                  insights.push('🌅 Great breakfast! Perfect way to start the day');
                }
                
                // Check lunch
                const lunch = chartData.find(m => m.name === 'Lunch');
                if (lunch && lunch.calories > totalCalories * 0.4) {
                  insights.push('🍽️ Lunch looks substantial - perfect for midday energy');
                } else if (!lunch || lunch.calories < 300) {
                  insights.push('🍽️ Consider a more filling lunch (400-500 kcal)');
                }
                
                // Check dinner
                const dinner = chartData.find(m => m.name === 'Dinner');
                if (dinner && dinner.calories > 500) {
                  insights.push('🌙 Try lighter dinners for better sleep quality');
                } else if (dinner && dinner.calories >= 300) {
                  insights.push('🌙 Well-balanced dinner size!');
                }
                
                // Check snacks
                const snack = chartData.find(m => m.name === 'Snack');
                if (snack && snack.count > 2) {
                  insights.push('🍎 Good snacking habits! Keep them healthy');
                } else if (!snack || snack.calories < 100) {
                  insights.push('🥜 Healthy snacks can help meet daily nutrition goals');
                }
                
                return insights.length > 0 ? insights : ['Great job tracking your meals!'];
              })().map((insight, index) => (
                <div key={index}>{insight}</div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}