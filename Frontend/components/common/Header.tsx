import React from 'react';
import { Page, Theme, User } from '../../types';
import { Icon } from './Icon';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  theme: Theme;
  toggleTheme: () => void;
  onAddFoodClick: () => void;
  currentUser: User | null;
  onLogout: () => void;
}

const NavItem: React.FC<{
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-primary-500 text-white'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`}
  >
    <Icon name={icon} className="w-5 h-5" />
    <span className="hidden sm:inline">{label}</span>
  </button>
);

export const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, theme, toggleTheme, onAddFoodClick, currentUser, onLogout }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
             <div className="flex-shrink-0 flex items-center gap-2">
                <Icon name="leaf" className="h-8 w-8 text-primary-500" />
                <span className="text-xl font-bold text-gray-800 dark:text-white">NutriGem</span>
            </div>
          </div>
          <nav className="flex items-center gap-2 sm:gap-4">
             <NavItem label="Dashboard" icon="grid-outline" isActive={currentPage === 'dashboard'} onClick={() => setCurrentPage('dashboard')} />
             <NavItem label="Progress" icon="stats-chart-outline" isActive={currentPage === 'progress'} onClick={() => setCurrentPage('progress')} />
             <NavItem label="Profile" icon="person-outline" isActive={currentPage === 'profile'} onClick={() => setCurrentPage('profile')} />
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
             <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Icon name={theme === 'light' ? 'moon-outline' : 'sunny-outline'} className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>
            <button onClick={onAddFoodClick} className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-all shadow">
                <Icon name="add-circle-outline" className="h-5 w-5" />
                <span className="hidden sm:inline">Add Food</span>
            </button>
            {currentUser?.username === 'Guest' ? (
                 <button onClick={onLogout} className="bg-green-500 text-white px-3 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors text-sm">
                    Sign Up / Login
                </button>
            ) : (
                <button onClick={onLogout} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <Icon name="log-out-outline" className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};