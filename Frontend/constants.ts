
import { MealType, ActivityLevel, FitnessGoal } from './types';

export const MEAL_TYPES: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

export const ACTIVITY_LEVEL_OPTIONS = [
  { value: ActivityLevel.Sedentary, label: 'Sedentary (little or no exercise)' },
  { value: ActivityLevel.LightlyActive, label: 'Lightly Active (light exercise/sports 1-3 days/week)' },
  { value: ActivityLevel.ModeratelyActive, label: 'Moderately Active (moderate exercise/sports 3-5 days/week)' },
  { value: ActivityLevel.VeryActive, label: 'Very Active (hard exercise/sports 6-7 days a week)' },
  { value: ActivityLevel.ExtraActive, label: 'Extra Active (very hard exercise/physical job)' },
];

export const FITNESS_GOAL_OPTIONS = [
    { value: FitnessGoal.Lose, label: 'Lose Weight' },
    { value: FitnessGoal.Maintain, label: 'Maintain Weight' },
    { value: FitnessGoal.Gain, label: 'Gain Weight' },
];
