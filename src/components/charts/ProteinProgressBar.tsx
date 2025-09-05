"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProteinProgressBarProps {
  consumed: number;
  target: number;
  className?: string;
}

export function ProteinProgressBar({ consumed, target, className }: ProteinProgressBarProps) {
  const percentage = Math.min((consumed / target) * 100, 100);
  const remaining = Math.max(target - consumed, 0);
  
  // Milestone markers (25%, 50%, 75%, 100%)
  const milestones = [
    { percentage: 25, label: '25%', value: Math.round(target * 0.25) },
    { percentage: 50, label: '50%', value: Math.round(target * 0.50) },
    { percentage: 75, label: '75%', value: Math.round(target * 0.75) },
    { percentage: 100, label: '100%', value: target }
  ];

  // Color coding based on progress
  const getColor = () => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-400';
  };

  const getTextColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    if (percentage >= 25) return 'text-orange-600';
    return 'text-red-500';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-center">Daily Protein</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main progress display */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {consumed}g
            </div>
            <div className="text-sm text-gray-500">of {target}g target</div>
            <div className={`text-lg font-semibold mt-1 ${getTextColor()}`}>
              {percentage.toFixed(1)}%
            </div>
          </div>

          {/* Custom progress bar with milestones */}
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
              {/* Progress fill */}
              <div 
                className={`h-full rounded-full transition-all duration-500 ease-in-out ${getColor()}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
              
              {/* Milestone markers */}
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="absolute top-0 h-full w-0.5 bg-white opacity-70"
                  style={{ left: `${milestone.percentage}%` }}
                  title={`${milestone.label}: ${milestone.value}g`}
                />
              ))}
              
              {/* Progress text overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-white drop-shadow-sm">
                  {consumed}g / {target}g
                </span>
              </div>
            </div>
            
            {/* Milestone labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              {milestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className="text-center"
                  style={{ 
                    marginLeft: index === 0 ? '0' : '-10px',
                    marginRight: index === milestones.length - 1 ? '0' : '-10px'
                  }}
                >
                  <div className="font-medium">{milestone.label}</div>
                  <div className="text-gray-400">{milestone.value}g</div>
                </div>
              ))}
            </div>
          </div>

          {/* Status and recommendations */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Remaining</span>
              <span className="text-sm font-medium text-gray-800">
                {remaining}g
              </span>
            </div>
            
            {/* Status message */}
            <div className="text-center p-3 rounded-lg bg-gray-50">
              <p className="text-sm">
                {percentage < 25 && (
                  <span className="text-red-600">
                    🥛 Start your day with protein! Try milk, eggs, or dal
                  </span>
                )}
                {percentage >= 25 && percentage < 50 && (
                  <span className="text-orange-600">
                    🥗 Good start! Add some paneer, chicken, or nuts to meals
                  </span>
                )}
                {percentage >= 50 && percentage < 80 && (
                  <span className="text-yellow-600">
                    💪 Halfway there! Include protein in your next meal
                  </span>
                )}
                {percentage >= 80 && percentage <= 100 && (
                  <span className="text-green-600">
                    🎉 Excellent! You&apos;re meeting your protein goals
                  </span>
                )}
                {percentage > 100 && (
                  <span className="text-blue-600">
                    ⭐ Outstanding! You&apos;ve exceeded your protein target
                  </span>
                )}
              </p>
            </div>

            {/* Protein recommendations */}
            {remaining > 10 && (
              <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-800 mb-1">
                  Protein-rich options:
                </div>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>Dal/Lentils (8g per cup)</div>
                  <div>Paneer (14g per 50g)</div>
                  <div>Greek Yogurt (10g per cup)</div>
                  <div>Almonds (6g per 30g)</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}