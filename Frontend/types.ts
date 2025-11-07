
export type Page = 'dashboard' | 'progress' | 'profile';
export type Theme = 'light' | 'dark';

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

export enum ActivityLevel {
  Sedentary = 1.2,
  LightlyActive = 1.375,
  ModeratelyActive = 1.55,
  VeryActive = 1.725,
  ExtraActive = 1.9,
}

export enum FitnessGoal {
  Lose = 0.8,
  Maintain = 1.0,
  Gain = 1.2,
}

export interface FoodItem {
  id: string;
  name: string;
  quantity: number; // in grams
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type DailyLog = Record<MealType, FoodItem[]>;

export interface ProfileData {
    age: number;
    gender: string;
    height: number;
    weight: number;
    goalWeight?: number;
    activityLevel: ActivityLevel;
    goal: FitnessGoal;
    goalType: 'auto' | 'custom';
    customCalorieGoal?: number;
    customProteinGoal?: number;
    customCarbsGoal?: number;
    customFatGoal?: number;
}


export interface WeightEntry {
  date: string; // YYYY-MM-DD
  weight: number; // in kg
}

export interface User {
  username: string;
}

export interface AuthResponse {
  success: boolean;
  user: User | null;
  error?: 'USER_NOT_FOUND' | 'USERNAME_TAKEN' | string;
}

export interface NutritionData {
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}