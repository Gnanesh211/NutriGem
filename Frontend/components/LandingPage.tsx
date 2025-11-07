import React, { useState } from 'react';
import { AuthPage } from './Auth';
import { AuthResponse } from '../types';
import { Icon } from './common/Icon';

interface LandingPageProps {
  login: (username: string) => Promise<AuthResponse>;
  signup: (username: string) => Promise<AuthResponse>;
  startDemo: () => void;
}

const FeatureCard: React.FC<{ icon: string, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white/5 dark:bg-gray-800/20 p-6 rounded-lg backdrop-blur-sm border border-white/10">
        <Icon name={icon} className="w-10 h-10 text-primary-400 mb-4" />
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-300">{children}</p>
    </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ login, signup, startDemo }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-800 text-white dark:bg-gray-900">
        <div className="relative isolate overflow-hidden">
             <div 
                className="absolute inset-0 bg-gradient-to-br from-primary-950 via-gray-900 to-gray-900 opacity-80"
                style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0% 100%)'
                }}
             ></div>
             <div 
                className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
             ></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="flex justify-between items-center py-6">
                     <div className="flex items-center gap-2">
                        <Icon name="leaf" className="h-8 w-8 text-primary-400" />
                        <span className="text-2xl font-bold">NutriGem</span>
                    </div>
                     <button 
                        onClick={() => setIsAuthModalOpen(true)}
                        className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        Login / Sign Up
                    </button>
                </header>

                <main className="py-20 sm:py-32 text-center">
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                        Achieve Your Health Goals with <span className="text-primary-400">AI Precision</span>
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300">
                        NutriGem is your intelligent nutrition assistant. Effortlessly track your meals, monitor macros, and get personalized insights powered by Gemini to reach your fitness targets faster.
                    </p>
                     <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button 
                            onClick={() => setIsAuthModalOpen(true)}
                            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform hover:scale-105 shadow-lg w-full sm:w-auto"
                        >
                            Get Started for Free
                        </button>
                        <button 
                            onClick={startDemo}
                            className="bg-transparent border border-primary-500 hover:bg-primary-500/20 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors w-full sm:w-auto"
                        >
                            Try a Live Demo
                        </button>
                    </div>
                </main>
            </div>
        </div>

        <section className="bg-gray-900 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold">Everything You Need to Succeed</h2>
                    <p className="text-gray-400 mt-2">All the tools for a healthier lifestyle, in one place.</p>
                </div>
                 <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard icon="sparkles-outline" title="AI-Powered Food Logging">
                        Just type what you ate, and our Gemini-powered engine instantly provides accurate nutritional information.
                    </FeatureCard>
                    <FeatureCard icon="stats-chart-outline" title="Visualize Your Progress">
                        Track your weight, calories, and macronutrients with beautiful, easy-to-understand charts.
                    </FeatureCard>
                    <FeatureCard icon="flag-outline" title="Personalized Goals">
                        Whether you want to lose, maintain, or gain weight, set custom goals that fit your lifestyle and body.
                    </FeatureCard>
                </div>
            </div>
        </section>

        <footer className="bg-gray-950 text-center py-6">
            <p className="text-gray-500">&copy; {new Date().getFullYear()} NutriGem. All rights reserved.</p>
        </footer>


      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative">
            <AuthPage login={login} signup={signup} />
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute -top-2 -right-2 text-gray-300 bg-gray-800 rounded-full p-1 hover:bg-gray-700"
              aria-label="Close authentication form"
            >
              <Icon name="close-outline" className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Add a simple fade-in animation to tailwind config.
// Since we can't edit index.html, we can inject a style tag.
// This is a common pattern in component-based libraries.
if (typeof window !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fadeIn 0.3s ease-out;
        }
    `;
    document.head.appendChild(style);
}