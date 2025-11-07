
import React from 'react';
import { NutritionStore } from '../hooks/useNutritionStore';
import { Card, CardContent, CardHeader } from './common/Card';
import { Icon } from './common/Icon';
import { MEAL_TYPES } from '../constants';
import { FoodItem, MealType } from '../types';

interface MacroCardProps {
  label: string;
  consumed: number;
  goal: number;
  unit: string;
  color: string;
}

const MacroCard: React.FC<MacroCardProps> = ({ label, consumed, goal, unit, color }) => {
  const percentage = goal > 0 ? (consumed / goal) * 100 : 0;
  return (
    <Card className="flex-1">
      <CardContent>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</h3>
        <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
          {Math.round(consumed)} / {Math.round(goal)}{unit}
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
          <div className={`${color} h-2 rounded-full`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
        </div>
      </CardContent>
    </Card>
  );
};

interface MealLogProps {
  mealType: MealType;
  foods: FoodItem[];
  onRemove: (mealType: MealType, foodId: string) => void;
}

const MealLog: React.FC<MealLogProps> = ({ mealType, foods, onRemove }) => {
  const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
  const iconMap: Record<MealType, string> = {
    Breakfast: 'cafe-outline',
    Lunch: 'restaurant-outline',
    Dinner: 'moon-outline',
    Snacks: 'ice-cream-outline'
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Icon name={iconMap[mealType]} className="text-primary-500 w-6 h-6" />
          <div>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{mealType}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{Math.round(totalCalories)} kcal</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {foods.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No food logged yet.</p>
        ) : (
          <ul className="space-y-3">
            {foods.map(food => (
              <li key={food.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{food.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{food.quantity}g - {Math.round(food.calories)} kcal</p>
                </div>
                <button onClick={() => onRemove(mealType, food.id)} className="text-red-500 hover:text-red-700">
                    <Icon name="trash-outline" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

interface WaterTrackerProps {
    intake: number;
    onAdd: (amount: number) => void;
    onReset: () => void;
}

const WaterTracker: React.FC<WaterTrackerProps> = ({ intake, onAdd, onReset }) => {
    const goal = 2000; // 2L
    const percentage = (intake/goal) * 100;
    const glasses = Math.floor(intake / 250);

    return (
        <Card>
            <CardHeader>
                <h3 className="font-semibold text-lg">Water Intake</h3>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-primary-500 mb-4">
                    <Icon name="water-outline" />
                    <span>{intake} / {goal} ml</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {Array.from({length: 8}).map((_, i) => (
                        <Icon key={i} name="water" className={`w-8 h-8 ${i < glasses ? 'text-blue-400' : 'text-gray-300 dark:text-gray-600'}`} />
                    ))}
                </div>
                 <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                    <div className="bg-blue-400 h-2.5 rounded-full" style={{width: `${Math.min(percentage, 100)}%`}}></div>
                </div>
                <div className="flex justify-center gap-2">
                    <button onClick={() => onAdd(250)} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">Add Glass (250ml)</button>
                    <button onClick={onReset} className="bg-gray-200 dark:bg-gray-600 px-4 py-2 rounded-lg text-sm">Reset</button>
                </div>
            </CardContent>
        </Card>
    )
}

interface DashboardProps {
  store: NutritionStore;
}

export const Dashboard: React.FC<DashboardProps> = ({ store }) => {
  const { totals, goals, dailyLog, removeFoodFromMeal, waterIntake, addWater, resetWater, resetDailyLog } = store;

  // Check if goals are loaded
  const hasGoals = goals && goals.calorieGoal > 0;

  const remainingCalories = goals.calorieGoal > 0 
  ? goals.calorieGoal - totals.calories 
  : null;


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button onClick={resetDailyLog} className="text-sm bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
          Reset Day
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardContent className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left">
              <h2 className="text-lg font-medium text-gray-500 dark:text-gray-400">Calories Remaining</h2>
              <p className="text-5xl font-bold text-primary-600 dark:text-primary-400">
  {remainingCalories !== null ? Math.round(remainingCalories) : "Set your goal in profile"}
</p>

            </div>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <div className="text-center">
                <p className="font-semibold">{Math.round(totals.calories)}</p>
                <p className="text-sm text-gray-500">Consumed</p>
              </div>
              <div className="text-2xl font-light text-gray-400">-</div>
              <div className="text-center">
                <p className="font-semibold">{hasGoals ? Math.round(goals.calorieGoal) : '—'}</p>
                <p className="text-sm text-gray-500">Goal</p>
              </div>
            </div>
          </CardContent>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-3">
            <div
              className="bg-primary-500 h-3"
              style={{ width: hasGoals ? `${(totals.calories / goals.calorieGoal) * 100}%` : '0%' }}
            ></div>
          </div>
        </Card>

        <WaterTracker intake={waterIntake} onAdd={addWater} onReset={resetWater} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <MacroCard label="Protein" consumed={totals.protein} goal={goals.proteinGoal} unit="g" color="bg-protein" />
        <MacroCard label="Carbs" consumed={totals.carbs} goal={goals.carbsGoal} unit="g" color="bg-carbs" />
        <MacroCard label="Fat" consumed={totals.fat} goal={goals.fatGoal} unit="g" color="bg-fat" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MEAL_TYPES.map(mealType => (
          <MealLog key={mealType} mealType={mealType} foods={dailyLog[mealType]} onRemove={removeFoodFromMeal} />
        ))}
      </div>
    </div>
  );
};
