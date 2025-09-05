"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NutritionTrend } from '@/types/nutrition';

interface NutritionTrendChartProps {
  data: NutritionTrend[];
  calorieTarget: number;
  proteinTarget: number;
  className?: string;
}

export function NutritionTrendChart({ 
  data, 
  calorieTarget, 
  proteinTarget, 
  className 
}: NutritionTrendChartProps) {
  // Format data for chart display
  const chartData = data.map((item, index) => ({
    ...item,
    day: `Day ${index + 1}`,
    shortDate: new Date(item.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === 'calories' ? ' kcal' : 
               entry.dataKey === 'protein' ? 'g' : 
               entry.dataKey === 'score' ? '/100' : ''}
            </p>
          ))}
          {payload[0]?.payload?.weight && (
            <p className="text-sm text-gray-600 mt-1">
              Weight: {payload[0].payload.weight} kg
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-center">
          7-Day Nutrition Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="shortDate" 
                  fontSize={12}
                  stroke="#666"
                />
                <YAxis 
                  yAxisId="left"
                  fontSize={12}
                  stroke="#666"
                  label={{ value: 'Calories / Protein', angle: -90, position: 'insideLeft' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  fontSize={12}
                  stroke="#666"
                  label={{ value: 'Score', angle: 90, position: 'insideRight' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                {/* Target reference lines */}
                <ReferenceLine 
                  yAxisId="left"
                  y={calorieTarget} 
                  stroke="#EF4444" 
                  strokeDasharray="5 5" 
                  label="Calorie Target"
                />
                <ReferenceLine 
                  yAxisId="left"
                  y={proteinTarget} 
                  stroke="#10B981" 
                  strokeDasharray="5 5"
                  label="Protein Target"
                />
                
                {/* Data lines */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="calories"
                  stroke="#EF4444"
                  strokeWidth={3}
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2 }}
                  name="Calories"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="protein"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                  name="Protein (g)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="score"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: '#3B82F6', strokeWidth: 2 }}
                  name="Nutrition Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Summary statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {(() => {
              const avgCalories = Math.round(data.reduce((sum, item) => sum + item.calories, 0) / data.length);
              const avgProtein = Math.round(data.reduce((sum, item) => sum + item.protein, 0) / data.length);
              const avgScore = Math.round(data.reduce((sum, item) => sum + item.score, 0) / data.length);
              const trend = data.length >= 2 
                ? data[data.length - 1].score - data[0].score 
                : 0;

              return (
                <>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">{avgCalories}</div>
                    <div className="text-sm text-red-500">Avg Calories</div>
                    <div className="text-xs text-gray-500">Target: {calorieTarget}</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{avgProtein}g</div>
                    <div className="text-sm text-green-500">Avg Protein</div>
                    <div className="text-xs text-gray-500">Target: {proteinTarget}g</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{avgScore}</div>
                    <div className="text-sm text-blue-500">Avg Score</div>
                    <div className="text-xs text-gray-500">Out of 100</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className={`text-lg font-bold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {trend >= 0 ? '+' : ''}{trend}
                    </div>
                    <div className="text-sm text-purple-500">Trend</div>
                    <div className="text-xs text-gray-500">Score change</div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Insights */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Weekly Insights
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              {(() => {
                const insights = [];
                const avgCalories = data.reduce((sum, item) => sum + item.calories, 0) / data.length;
                const avgProtein = data.reduce((sum, item) => sum + item.protein, 0) / data.length;
                
                if (avgCalories < calorieTarget * 0.9) {
                  insights.push('📈 Consider increasing calorie intake to meet your goals');
                } else if (avgCalories > calorieTarget * 1.1) {
                  insights.push('📉 Try reducing portion sizes to align with targets');
                }
                
                if (avgProtein < proteinTarget * 0.8) {
                  insights.push('🥛 Increase protein with dal, paneer, or yogurt');
                } else if (avgProtein >= proteinTarget) {
                  insights.push('💪 Excellent protein intake! Keep it up');
                }
                
                const consistentDays = data.filter(d => d.score >= 75).length;
                if (consistentDays >= data.length * 0.7) {
                  insights.push('🎉 Great consistency in meeting nutrition goals');
                } else {
                  insights.push('📊 Focus on consistency for better results');
                }
                
                return insights.length > 0 ? insights : ['Keep logging your meals for personalized insights!'];
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