import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './common/Icon';
import { Card, CardContent } from './common/Card';
import { AuthResponse } from '../types';

interface AuthPageProps {
  login: (username: string) => Promise<AuthResponse>;
  signup: (username: string) => Promise<AuthResponse>;
}

export const AuthPage: React.FC<AuthPageProps> = ({ login, signup }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const notificationTimeoutRef = useRef<number | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
    }
    setNotification({ message, type });
    notificationTimeoutRef.current = window.setTimeout(() => {
        setNotification(null);
    }, 5000);
  };

  useEffect(() => {
    return () => {
        if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
        }
    }
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);
    setIsLoading(true);

    if (username.trim().length < 3) {
      showNotification("Username must be at least 3 characters long.", 'error');
      setIsLoading(false);
      return;
    }

    try {
      const response = isLoginView ? await login(username) : await signup(username);
      
      if (response.success) {
        if (!isLoginView) {
            showNotification('Account created! Logging you in...', 'success');
        }
        // For login, the automatic redirect is the success indicator.
      } else {
        if (response.error === 'USER_NOT_FOUND') {
            showNotification('Account not found. Please use the form below to sign up.', 'error');
            setIsLoginView(false); // Switch to sign up view
        } else if (response.error === 'USERNAME_TAKEN') {
            showNotification('This username is already taken. Please choose another.', 'error');
        } else {
            showNotification('An unexpected error occurred.', 'error');
        }
      }

    } catch (err) {
      showNotification('An unexpected error occurred.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-center items-center gap-3 mb-6">
          <Icon name="leaf" className="h-10 w-10 text-primary-500" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">NutriGem</h1>
      </div>
      <Card>
          <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-1">{isLoginView ? 'Welcome Back!' : 'Create Account'}</h2>
              <p className="text-center text-gray-500 dark:text-gray-400 mb-6">{isLoginView ? 'Log in to continue' : 'Get started with your nutrition journey'}</p>
              
              {notification && (
                  <div className={`p-3 rounded-md mb-4 text-sm font-medium text-center ${
                      notification.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                      {notification.message}
                  </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                      <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 text-black placeholder-gray-400"
                          placeholder="your_username"
                      />
                  </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                       <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 text-black placeholder-gray-400"
                          placeholder="••••••••"
                      />
                       <p className="text-xs text-gray-400 mt-1">Note: For this demo, any password will work.</p>
                  </div>

                  <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary-600 text-white p-2.5 rounded-md font-semibold hover:bg-primary-700 disabled:bg-primary-300 flex items-center justify-center gap-2"
                      >
                       {isLoading ? (
                          <>
                          <Icon name="sync-outline" className="animate-spin w-5 h-5" />
                          <span>Processing...</span>
                          </>
                      ) : (
                          isLoginView ? 'Log In' : 'Sign Up'
                      )}
                  </button>
              </form>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                  {isLoginView ? "Don't have an account?" : "Already have an account?"}
                  <button onClick={() => { setIsLoginView(!isLoginView); setNotification(null); }} className="font-semibold text-primary-600 hover:text-primary-500 ml-1">
                      {isLoginView ? 'Sign Up' : 'Log In'}
                  </button>
              </p>
          </CardContent>
      </Card>
    </div>
  );
};