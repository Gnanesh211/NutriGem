import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Dashboard } from './components/Dashboard';
import { Progress } from './components/Progress';
import { Profile } from './components/Profile';
import { useNutritionStore } from './hooks/useNutritionStore';
import { AddFoodModal } from './components/AddFoodModal';
import { LandingPage } from './components/LandingPage';
import { Page, Theme } from './types';
import { Icon } from './components/common/Icon';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const nutritionStore = useNutritionStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard store={nutritionStore} />;
      case 'progress':
        return <Progress store={nutritionStore} />;
      case 'profile':
        return <Profile store={nutritionStore} />;
      default:
        return <Dashboard store={nutritionStore} />;
    }
  };

  if (nutritionStore.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Icon name="sync-outline" className="animate-spin w-12 h-12 text-primary-500" />
      </div>
    );
  }

  if (!nutritionStore.isAuthenticated) {
    return <LandingPage login={nutritionStore.login} signup={nutritionStore.signup} startDemo={nutritionStore.startDemo} />;
  }

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        theme={theme}
        toggleTheme={toggleTheme}
        onAddFoodClick={() => setIsModalOpen(true)}
        currentUser={nutritionStore.currentUser}
        onLogout={nutritionStore.logout}
      />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {renderPage()}
      </main>
      <AddFoodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addFoodToMeal={nutritionStore.addFoodToMeal}
      />
    </div>
  );
};

export default App;