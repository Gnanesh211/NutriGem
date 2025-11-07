
import { ProfileData, ActivityLevel } from '../types';

// Mifflin-St Jeor Equation
export const calculateBMR = (profile: ProfileData): number => {
  const { weight, height, age, gender } = profile;
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

export const calculateTDEE = (bmr: number, activityLevel: ActivityLevel): number => {
  return bmr * activityLevel;
};
