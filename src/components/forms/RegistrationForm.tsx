"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UserProfile, NutritionGoals } from '@/types/user';
import { DataStorage } from '@/lib/data-storage';
import { NutritionCalculator } from '@/lib/nutrition-calculator';

interface RegistrationFormProps {
  onComplete: (user: UserProfile, goals: NutritionGoals) => void;
  className?: string;
}

export function RegistrationForm({ onComplete, className }: RegistrationFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    goal: '',
    dietPreference: '',
    region: '',
    healthIssues: ''
  });

  const totalSteps = 3;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Create user profile
      const userProfile: UserProfile = {
        id: Date.now().toString(),
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender as 'male' | 'female' | 'other',
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        activityLevel: formData.activityLevel as 'low' | 'moderate' | 'high',
        goal: formData.goal as 'weight_loss' | 'weight_gain' | 'balanced_diet',
        dietPreference: formData.dietPreference as 'vegetarian' | 'non_vegetarian' | 'vegan',
        region: formData.region,
        healthIssues: formData.healthIssues.split(',').map(issue => issue.trim()).filter(Boolean),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Calculate nutrition goals
      const nutritionGoals = NutritionCalculator.calculateNutritionGoals(userProfile);

      // Save to storage
      DataStorage.saveUserProfile(userProfile);
      DataStorage.saveNutritionGoals(nutritionGoals);

      // Initialize today's nutrition tracking
      const today = new Date().toISOString().split('T')[0];
      DataStorage.initializeDailyNutrition(today, nutritionGoals);

      onComplete(userProfile, nutritionGoals);
    } catch (error) {
      console.error('Error completing registration:', error);
      alert('Error completing registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateStep1 = () => {
    return formData.name && formData.age && formData.gender;
  };

  const validateStep2 = () => {
    return formData.height && formData.weight && formData.activityLevel;
  };

  const validateStep3 = () => {
    return formData.goal && formData.dietPreference && formData.region;
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Namaste! Welcome to NutriAI 🙏
        </h2>
        <p className="text-gray-600 mt-2">
          Let&apos;s start your personalized nutrition journey
        </p>
      </div>

      <div>
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="age">Age *</Label>
        <Input
          id="age"
          type="number"
          placeholder="Enter your age"
          value={formData.age}
          onChange={(e) => handleInputChange('age', e.target.value)}
          min="1"
          max="120"
        />
      </div>

      <div>
        <Label htmlFor="gender">Gender *</Label>
        <Select onValueChange={(value) => handleInputChange('gender', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Physical Details 📏
        </h2>
        <p className="text-gray-600 mt-2">
          Help us calculate your personalized nutrition goals
        </p>
      </div>

      <div>
        <Label htmlFor="height">Height (cm) *</Label>
        <Input
          id="height"
          type="number"
          placeholder="Enter your height in cm"
          value={formData.height}
          onChange={(e) => handleInputChange('height', e.target.value)}
          min="100"
          max="250"
        />
      </div>

      <div>
        <Label htmlFor="weight">Weight (kg) *</Label>
        <Input
          id="weight"
          type="number"
          placeholder="Enter your weight in kg"
          value={formData.weight}
          onChange={(e) => handleInputChange('weight', e.target.value)}
          min="30"
          max="300"
          step="0.1"
        />
      </div>

      <div>
        <Label htmlFor="activity">Activity Level *</Label>
        <Select onValueChange={(value) => handleInputChange('activityLevel', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your activity level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low (Sedentary work, minimal exercise)</SelectItem>
            <SelectItem value="moderate">Moderate (Regular exercise 3-5 times/week)</SelectItem>
            <SelectItem value="high">High (Intense exercise 6+ times/week)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Diet Preferences 🍽️
        </h2>
        <p className="text-gray-600 mt-2">
          Personalize your Indian nutrition plan
        </p>
      </div>

      <div>
        <Label htmlFor="goal">Health Goal *</Label>
        <Select onValueChange={(value) => handleInputChange('goal', value)}>
          <SelectTrigger>
            <SelectValue placeholder="What&apos;s your primary goal?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weight_loss">Weight Loss</SelectItem>
            <SelectItem value="weight_gain">Weight Gain</SelectItem>
            <SelectItem value="balanced_diet">Balanced/Healthy Diet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="diet">Diet Preference *</Label>
        <Select onValueChange={(value) => handleInputChange('dietPreference', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your diet preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vegetarian">Vegetarian</SelectItem>
            <SelectItem value="non_vegetarian">Non-Vegetarian</SelectItem>
            <SelectItem value="vegan">Vegan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="region">Preferred Indian Cuisine *</Label>
        <Select onValueChange={(value) => handleInputChange('region', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your preferred regional cuisine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="north_indian">North Indian</SelectItem>
            <SelectItem value="south_indian">South Indian</SelectItem>
            <SelectItem value="gujarati">Gujarati</SelectItem>
            <SelectItem value="marathi">Marathi</SelectItem>
            <SelectItem value="bengali">Bengali</SelectItem>
            <SelectItem value="punjabi">Punjabi</SelectItem>
            <SelectItem value="rajasthani">Rajasthani</SelectItem>
            <SelectItem value="mixed">Mixed Regional</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="health">Health Issues (Optional)</Label>
        <Textarea
          id="health"
          placeholder="e.g., PCOS, thyroid, diabetes, acne (comma separated)"
          value={formData.healthIssues}
          onChange={(e) => handleInputChange('healthIssues', e.target.value)}
          rows={3}
        />
        <p className="text-xs text-gray-500 mt-1">
          This helps us provide better recommendations
        </p>
      </div>
    </div>
  );

  const canProceed = () => {
    if (step === 1) return validateStep1();
    if (step === 2) return validateStep2();
    if (step === 3) return validateStep3();
    return false;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            Setup Your Profile
          </CardTitle>
          <span className="text-sm text-gray-500">
            Step {step} of {totalSteps}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-orange-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="min-h-[400px]">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1 || loading}
          >
            Previous
          </Button>

          {step < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Profile...
                </div>
              ) : (
                'Complete Setup'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}