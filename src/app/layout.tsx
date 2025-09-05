import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NutriAI - Your AI-Powered Indian Dietician',
  description: 'Personalized Indian nutrition planning with AI-powered meal suggestions, nutrition tracking, and health insights tailored to your regional preferences and goals.',
  keywords: 'nutrition, diet, Indian food, AI dietician, meal planning, health tracking',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}