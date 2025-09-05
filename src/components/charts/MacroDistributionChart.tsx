"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MacroData {
  carbs: number;
  protein: number;
  fats: number;
}

interface MacroDistributionChartProps {
  consumed: MacroData;
  target: MacroData;
  className?: string;
}

export function MacroDistributionChart({ consumed, target, className }: MacroDistributionChartProps) {
  // Convert grams to calories for proper distribution calculation
  const consumedCalories = {
    carbs: consumed.carbs * 4, // 4 cal/g
    protein: consumed.protein * 4, // 4 cal/g
    fats: consumed.fats * 9 // 9 cal/g
  };

  const targetCalories = {
    carbs: target.carbs * 4,
    protein: target.protein * 4,
    fats: target.fats * 9
  };

  const totalConsumedCal = consumedCalories.carbs + consumedCalories.protein + consumedCalories.fats;
  const totalTargetCal = targetCalories.carbs + targetCalories.protein + targetCalories.fats;

  // Current distribution data
  const currentData = [
    {
      name: 'Carbohydrates',
      value: consumed.carbs,
      calories: consumedCalories.carbs,
      percentage: totalConsumedCal > 0 ? (consumedCalories.carbs / totalConsumedCal * 100) : 0,
      color: '#3B82F6', // Blue
      unit: 'g'
    },
    {
      name: 'Protein',
      value: consumed.protein,
      calories: consumedCalories.protein,
      percentage: totalConsumedCal > 0 ? (consumedCalories.protein / totalConsumedCal * 100) : 0,
      color: '#10B981', // Green
      unit: 'g'
    },
    {
      name: 'Fats',
      value: consumed.fats,
      calories: consumedCalories.fats,
      percentage: totalConsumedCal > 0 ? (consumedCalories.fats / totalConsumedCal * 100) : 0,
      color: '#F59E0B', // Amber
      unit: 'g'
    }
  ];

  // Target distribution for comparison
  const targetData = [
    {
      name: 'Carbs Target',
      value: target.carbs,
      percentage: targetCalories.carbs / totalTargetCal * 100,
      color: '#BFDBFE' // Light blue
    },
    {
      name: 'Protein Target',
      value: target.protein,
      percentage: targetCalories.protein / totalTargetCal * 100,
      color: '#A7F3D0' // Light green
    },
    {
      name: 'Fats Target',
      value: target.fats,
      percentage: targetCalories.fats / totalTargetCal * 100,
      color: '#FCD34D' // Light amber
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">
            Amount: {data.value}{data.unit}
          </p>
          <p className="text-sm text-gray-600">
            Calories: {data.calories} kcal
          </p>
          <p className="text-sm text-gray-600">
            Percentage: {data.percentage.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    if (percentage < 5) return null; // Don't show label for small segments
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${percentage.toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-center">
          Macro Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Pie Chart */}
          <div className="relative h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {currentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Macro breakdown */}
          <div className="space-y-3">
            {currentData.map((macro, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: macro.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {macro.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-800">
                    {macro.value}g ({macro.percentage.toFixed(1)}%)
                  </div>
                  <div className="text-xs text-gray-500">
                    {macro.calories} kcal
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Target vs Current comparison */}
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Target vs Current
            </h4>
            <div className="space-y-2">
              {currentData.map((macro, index) => {
                const targetMacro = targetData[index];
                const isOnTrack = Math.abs(macro.percentage - targetMacro.percentage) <= 5;
                
                return (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{macro.name.split(' ')[0]}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">
                        {macro.percentage.toFixed(1)}% / {targetMacro.percentage.toFixed(1)}%
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isOnTrack ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {isOnTrack ? 'On track' : 'Adjust'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Indian diet context */}
          <div className="bg-orange-50 p-3 rounded-lg">
            <h4 className="text-sm font-semibold text-orange-800 mb-2">
              Indian Diet Balance
            </h4>
            <div className="text-xs text-orange-700 space-y-1">
              <div><strong>Carbs:</strong> Rice, roti, dal provide sustained energy</div>
              <div><strong>Protein:</strong> Combine dal + rice for complete proteins</div>
              <div><strong>Fats:</strong> Use ghee, oils, nuts for healthy fats</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}