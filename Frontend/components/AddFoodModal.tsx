
import React, { useState } from 'react';
import { getNutritionInfo } from '../services/geminiService';
import { MealType, FoodItem, NutritionData } from '../types';
import { MEAL_TYPES } from '../constants';
import { Icon } from './common/Icon';
import { Card, CardContent } from './common/Card';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  addFoodToMeal: (mealType: MealType, foodItem: Omit<FoodItem, 'id'>) => void;
}

export const AddFoodModal: React.FC<AddFoodModalProps> = ({ isOpen, onClose, addFoodToMeal }) => {
  const [foodQuery, setFoodQuery] = useState('');
  const [quantity, setQuantity] = useState(100);
  const [selectedMeal, setSelectedMeal] = useState<MealType>('Breakfast');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nutritionResult, setNutritionResult] = useState<NutritionData | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodQuery.trim()) {
      setError('Please enter a food name.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setNutritionResult(null);
    try {
      const result = await getNutritionInfo(foodQuery, quantity);
      setNutritionResult(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFood = () => {
    if (nutritionResult) {
      addFoodToMeal(selectedMeal, {
        name: nutritionResult.name,
        quantity,
        calories: nutritionResult.calories,
        protein: nutritionResult.protein,
        carbs: nutritionResult.carbohydrates,
        fat: nutritionResult.fat,
      });
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setFoodQuery('');
    setQuantity(100);
    setSelectedMeal('Breakfast');
    setNutritionResult(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Add Food</h2>
            <button onClick={resetAndClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
              <Icon name="close-outline" className="w-7 h-7" />
            </button>
          </div>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                <input
                type="text"
                value={foodQuery}
                onChange={e => setFoodQuery(e.target.value)}
                placeholder="e.g., Apple"
                className="col-span-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500"
                />
                 <div className="relative">
                    <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <span className="absolute right-3 top-2 text-gray-500">g</span>
                </div>
            </div>
            
            <select
              value={selectedMeal}
              onChange={e => setSelectedMeal(e.target.value as MealType)}
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {MEAL_TYPES.map(meal => (
                <option key={meal} value={meal}>{meal}</option>
              ))}
            </select>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 text-white p-2 rounded-md font-semibold hover:bg-primary-700 disabled:bg-primary-300 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Icon name="sync-outline" className="animate-spin w-5 h-5" />
                  <span>Analyzing...</span>
                </>
              ) : (
                'Find Food'
              )}
            </button>
          </form>

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          
          {nutritionResult && (
            <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold text-center">Nutrition Facts for {quantity}g of {nutritionResult.name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <p className="font-bold text-xl text-primary-500">{Math.round(nutritionResult.calories)}</p>
                        <p className="text-sm">Calories</p>
                    </div>
                     <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <p className="font-bold text-xl text-protein">{Math.round(nutritionResult.protein)}g</p>
                        <p className="text-sm">Protein</p>
                    </div>
                     <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <p className="font-bold text-xl text-carbs">{Math.round(nutritionResult.carbohydrates)}g</p>
                        <p className="text-sm">Carbs</p>
                    </div>
                     <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <p className="font-bold text-xl text-fat">{Math.round(nutritionResult.fat)}g</p>
                        <p className="text-sm">Fat</p>
                    </div>
                </div>
              <button
                onClick={handleAddFood}
                className="w-full bg-green-600 text-white p-2 rounded-md font-semibold hover:bg-green-700"
              >
                Add to {selectedMeal}
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
