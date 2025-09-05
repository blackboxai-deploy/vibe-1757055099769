"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CalorieRingChartProps {
  consumed: number;
  target: number;
  className?: string;
}

export function CalorieRingChart({ consumed, target, className }: CalorieRingChartProps) {
  const percentage = Math.min((consumed / target) * 100, 100);
  const remaining = Math.max(target - consumed, 0);
  
  // Color coding based on progress
  const getColor = () => {
    if (percentage >= 95 && percentage <= 105) return '#10B981'; // Green - on track
    if (percentage >= 80 && percentage < 95) return '#F59E0B'; // Yellow - under
    if (percentage > 105) return '#EF4444'; // Red - over
    return '#6B7280'; // Gray - far under
  };

  const data = [
    { name: 'Consumed', value: consumed, color: getColor() },
    { name: 'Remaining', value: remaining, color: '#E5E7EB' }
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label for small segments

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
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-center">Daily Calories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center statistics */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {consumed}
              </div>
              <div className="text-sm text-gray-500">of {target}</div>
              <div className="text-xs text-gray-400 mt-1">calories</div>
            </div>
          </div>
        </div>

        {/* Progress indicators */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium" style={{ color: getColor() }}>
              {percentage.toFixed(1)}%
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Remaining</span>
            <span className="text-sm font-medium text-gray-800">
              {remaining} kcal
            </span>
          </div>
          
          {/* Status message */}
          <div className="text-center mt-3 p-2 rounded-lg bg-gray-50">
            <p className="text-sm">
              {percentage < 80 && (
                <span className="text-orange-600">
                  You need {remaining} more calories today
                </span>
              )}
              {percentage >= 80 && percentage <= 105 && (
                <span className="text-green-600">
                  Great job! You&apos;re on track with your calorie goal
                </span>
              )}
              {percentage > 105 && (
                <span className="text-red-600">
                  You&apos;ve exceeded your daily goal by {consumed - target} calories
                </span>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}