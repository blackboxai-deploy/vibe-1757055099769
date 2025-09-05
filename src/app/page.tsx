"use client";

import { useState, useEffect } from 'react';
import { NutritionDashboard } from '@/components/dashboard/NutritionDashboard';
import { RegistrationForm } from '@/components/forms/RegistrationForm';
import { DataStorage } from '@/lib/data-storage';
import { UserProfile, NutritionGoals } from '@/types/user';

export default function HomePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    checkUserProfile();
  }, []);

  const checkUserProfile = () => {
    try {
      const userProfile = DataStorage.getUserProfile();
      const nutritionGoals = DataStorage.getNutritionGoals();
      
      if (userProfile && nutritionGoals) {
        setUser(userProfile);
        setShowRegistration(false);
      } else {
        setShowRegistration(true);
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
      setShowRegistration(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationComplete = (newUser: UserProfile) => {
    setUser(newUser);
    setShowRegistration(false);
  };

  const handleResetProfile = () => {
    if (confirm('Are you sure you want to reset your profile? All data will be lost.')) {
      DataStorage.clearAllData();
      setUser(null);
      setShowRegistration(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">NutriAI</h2>
          <p className="text-gray-600">Loading your personalized nutrition dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-orange-600">
                NutriAI
              </h1>
              <span className="ml-2 text-sm text-gray-500">
                Your AI-Powered Indian Dietician
              </span>
            </div>
            
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user.name}! 🙏
                </span>
                <button
                  onClick={handleResetProfile}
                  className="text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                  Reset Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showRegistration ? (
          <div className="max-w-2xl mx-auto">
            <RegistrationForm
              onComplete={handleRegistrationComplete}
              className="bg-white shadow-lg"
            />
          </div>
        ) : (
          <NutritionDashboard className="w-full" />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-3xl mb-4">🙏</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              NutriAI - Your Personalized Indian Dietician
            </h3>
            <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
              Combining traditional Indian nutrition wisdom with modern AI technology 
              to provide you with personalized meal plans, nutrition tracking, and 
              health insights tailored to your regional preferences and health goals.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-sm text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">🍽️ Meal Planning</h4>
                <p>AI-powered Indian meal suggestions based on your preferences and health goals</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">📊 Nutrition Tracking</h4>
                <p>Interactive charts and visualizations to track your daily nutrition progress</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">🧘 Holistic Approach</h4>
                <p>Includes yoga and exercise recommendations suitable for Indian lifestyle</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">🏥 Health-Aware</h4>
                <p>Considers your specific health conditions for personalized recommendations</p>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t text-sm text-gray-500">
              <p>
                Built with Next.js, React, Tailwind CSS, and Recharts for modern, 
                responsive nutrition tracking and visualization.
              </p>
              <p className="mt-2">
                AI-powered by Claude Sonnet 4 via OpenRouter for intelligent meal planning 
                and nutrition analysis.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}