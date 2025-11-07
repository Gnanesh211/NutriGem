import { useState, useMemo, useCallback, useEffect } from 'react';
import { DailyLog, ProfileData, MealType, FoodItem, WeightEntry, User, AuthResponse, ActivityLevel, FitnessGoal } from '../types';
import { calculateBMR, calculateTDEE } from '../utils/calculators';
import { MEAL_TYPES } from '../constants';
import * as api from '../services/api';

const initialDailyLog = MEAL_TYPES.reduce((acc, meal) => {
    acc[meal] = [];
    return acc;
}, {} as DailyLog);

// --- Sample Data for Demo Mode ---
const demoProfile: ProfileData = {
  age: 28,
  gender: 'female',
  height: 165,
  weight: 62,
  goalWeight: 60,
  activityLevel: ActivityLevel.LightlyActive,
  goal: FitnessGoal.Lose,
  goalType: 'auto',
};

const demoDailyLog: DailyLog = {
  Breakfast: [
    { id: 'd1', name: 'Oatmeal', quantity: 50, calories: 190, protein: 7, carbs: 32, fat: 4 },
    { id: 'd2', name: 'Blueberries', quantity: 100, calories: 57, protein: 1, carbs: 14, fat: 0.5 },
  ],
  Lunch: [
     { id: 'd3', name: 'Grilled Chicken Salad', quantity: 250, calories: 350, protein: 30, carbs: 15, fat: 18 },
  ],
  Dinner: [],
  Snacks: [],
};

const demoWeightLog: WeightEntry[] = [
    { date: '2023-10-01', weight: 64 },
    { date: '2023-10-08', weight: 63.5 },
    { date: '2023-10-15', weight: 63 },
    { date: '2023-10-22', weight: 62.5 },
    { date: '2023-10-29', weight: 62 },
];
// --- End Sample Data ---


export const useNutritionStore = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [dailyLog, setDailyLog] = useState<DailyLog>(initialDailyLog);
  const [waterIntake, setWaterIntake] = useState<number>(0);
  const [weightLog, setWeightLog] = useState<WeightEntry[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const user = await api.apiCheckCurrentUser();
      if (user) {
        await loadUserData(user);
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);
  
  const loadUserData = async (user: User) => {
      try {
        const data = await api.apiFetchUserData(user.username);
        setProfile(data.profile);
        setDailyLog(data.dailyLog);
        setWaterIntake(data.waterIntake);
        setWeightLog(data.weightLog);
      } catch (error) {
          console.error("Failed to load user data", error);
      }
  };

  const login = useCallback(async (username: string): Promise<AuthResponse> => {
    setIsLoading(true);
    const response = await api.apiLogin(username);
    if (response.success && response.user) {
      await loadUserData(response.user);
      setCurrentUser(response.user);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
    return response;
  }, []);

  const signup = useCallback(async (username: string): Promise<AuthResponse> => {
    setIsLoading(true);
    const response = await api.apiSignup(username);
     if (response.success && response.user) {
      await loadUserData(response.user);
      setCurrentUser(response.user);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
    return response;
  }, []);

  const logout = useCallback(async () => {
    if (currentUser?.username === 'Guest') {
        setCurrentUser(null);
        setIsAuthenticated(false);
        setProfile(null);
        setDailyLog(initialDailyLog);
        setWaterIntake(0);
        setWeightLog([]);
        return;
    }
    await api.apiLogout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setProfile(null);
    setDailyLog(initialDailyLog);
    setWaterIntake(0);
    setWeightLog([]);
  }, [currentUser]);

  const startDemo = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentUser({ username: 'Guest' });
      setProfile(demoProfile);
      setDailyLog(demoDailyLog);
      setWaterIntake(750);
      setWeightLog(demoWeightLog);
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 400);
  }, []);

  const addFoodToMeal = useCallback(async (mealType: MealType, foodItem: Omit<FoodItem, 'id'>) => {
    if (!currentUser) return;
    const newFoodItem: FoodItem = { ...foodItem, id: new Date().toISOString() };
    const newLog = {
      ...dailyLog,
      [mealType]: [...dailyLog[mealType], newFoodItem],
    };
    setDailyLog(newLog); 
    if (currentUser.username !== 'Guest') {
        await api.apiUpdateDailyLog(currentUser.username, newLog);
    }
  }, [dailyLog, currentUser]);
  
  const removeFoodFromMeal = useCallback(async (mealType: MealType, foodId: string) => {
    if (!currentUser) return;
    const newLog = {
      ...dailyLog,
      [mealType]: dailyLog[mealType].filter(item => item.id !== foodId),
    };
    setDailyLog(newLog);
    if (currentUser.username !== 'Guest') {
        await api.apiUpdateDailyLog(currentUser.username, newLog);
    }
  }, [dailyLog, currentUser]);

  const updateProfile = useCallback(async (newProfile: ProfileData) => {
    if (!currentUser) return;
    setProfile(newProfile); 
    if (currentUser.username !== 'Guest') {
        await api.apiUpdateProfile(currentUser.username, newProfile);
    }
  }, [currentUser]);

  const addWater = useCallback(async (amount: number) => {
      if (!currentUser) return;
      const newIntake = waterIntake + amount;
      setWaterIntake(newIntake);
       if (currentUser.username !== 'Guest') {
            await api.apiUpdateWaterIntake(currentUser.username, newIntake);
       }
  }, [waterIntake, currentUser]);

  const resetWater = useCallback(async () => {
    if (!currentUser) return;
    setWaterIntake(0);
     if (currentUser.username !== 'Guest') {
        await api.apiUpdateWaterIntake(currentUser.username, 0);
     }
  }, [currentUser]);
  
  const addWeightEntry = useCallback(async (weight: number) => {
      if (!currentUser || !profile) return;
      const today = new Date().toISOString().split('T')[0];
      const newLog = [...weightLog.filter(entry => entry.date !== today), { date: today, weight }]
          .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setWeightLog(newLog);
      
      const newProfile = {...profile, weight};
      setProfile(newProfile);

      if (currentUser.username !== 'Guest') {
        await Promise.all([
            api.apiUpdateWeightLog(currentUser.username, newLog),
            api.apiUpdateProfile(currentUser.username, newProfile)
        ]);
      }
  }, [weightLog, profile, currentUser]);
  
  const resetDailyLog = useCallback(async () => {
    if (!currentUser) return;
    setDailyLog(initialDailyLog);
    setWaterIntake(0);
    if (currentUser.username !== 'Guest') {
        await Promise.all([
            api.apiUpdateDailyLog(currentUser.username, initialDailyLog),
            api.apiUpdateWaterIntake(currentUser.username, 0)
        ]);
    }
  }, [currentUser]);

  const totals = useMemo(() => {
    let calories = 0, protein = 0, carbs = 0, fat = 0;
    Object.values(dailyLog).flat().forEach((item: FoodItem) => {
      calories += item.calories;
      protein += item.protein;
      carbs += item.carbs;
      fat += item.fat;
    });
    return { calories, protein, carbs, fat };
  }, [dailyLog]);

  const goals = useMemo(() => {
    if (!profile) {
      return { calorieGoal: 2000, proteinGoal: 150, carbsGoal: 200, fatGoal: 67 };
    }
    
    const bmr = calculateBMR(profile);
    const tdee = calculateTDEE(bmr, profile.activityLevel);
    const autoCalorieGoal = Math.round(tdee * profile.goal);
    const autoProteinGoal = Math.round((autoCalorieGoal * 0.30) / 4);
    const autoCarbsGoal = Math.round((autoCalorieGoal * 0.40) / 4);
    const autoFatGoal = Math.round((autoCalorieGoal * 0.30) / 9);

    if (profile.goalType === 'custom') {
      return {
        calorieGoal: profile.customCalorieGoal ?? autoCalorieGoal,
        proteinGoal: profile.customProteinGoal ?? autoProteinGoal,
        carbsGoal: profile.customCarbsGoal ?? autoCarbsGoal,
        fatGoal: profile.customFatGoal ?? autoFatGoal,
      };
    }

    return { calorieGoal: autoCalorieGoal, proteinGoal: autoProteinGoal, carbsGoal: autoCarbsGoal, fatGoal: autoFatGoal };
  }, [profile]);
  
  return {
    profile,
    dailyLog,
    totals,
    goals,
    waterIntake,
    weightLog,
    updateProfile,
    addFoodToMeal,
    removeFoodFromMeal,
    addWater,
    resetWater,
    addWeightEntry,
    resetDailyLog,
    isAuthenticated,
    currentUser,
    login,
    signup,
    logout,
    startDemo,
    isLoading: isLoading || (isAuthenticated && profile === null),
  };
};

export type NutritionStore = ReturnType<typeof useNutritionStore>;