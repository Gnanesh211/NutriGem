
import React, { useState, useEffect } from 'react';
import { NutritionStore } from '../hooks/useNutritionStore';
import { ProfileData } from '../types';
import { Card, CardContent, CardHeader } from './common/Card';
import { ACTIVITY_LEVEL_OPTIONS, FITNESS_GOAL_OPTIONS } from '../constants';
import { Icon } from './common/Icon';

interface ProfileProps {
  store: NutritionStore;
}

const StatCard: React.FC<{ label: string, value: string | number, unit?: string, icon: string }> = ({ label, value, unit, icon }) => (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
        <Icon name={icon} className="text-3xl text-primary-500 mx-auto mb-2"></Icon>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-xl font-bold">{value} <span className="text-base font-normal">{unit}</span></p>
    </div>
)


export const Profile: React.FC<ProfileProps> = ({ store }) => {
  const { profile, updateProfile, goals } = store;
  const [formData, setFormData] = useState<ProfileData>(profile);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const isStringField = ['gender', 'activityLevel', 'goal', 'goalType'].includes(name);
        if (isStringField) {
            return { ...prev, [name]: value };
        }
        // For number fields, handle empty string case to store as undefined
        const numValue = value === '' ? undefined : Number(value);
        return { ...prev, [name]: numValue };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile(formData);
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };
  
  if (!profile) {
    return (
        <Card>
            <CardContent className="flex items-center justify-center h-64">
                <Icon name="sync-outline" className="animate-spin w-8 h-8 text-primary-500" />
            </CardContent>
        </Card>
    );
  }

  const inputClass = "w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  
  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold">Profile & Goals</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           <StatCard label="Calorie Goal" value={Math.round(goals.calorieGoal)} unit="kcal" icon="flame-outline" />
           <StatCard label="Protein Goal" value={Math.round(goals.proteinGoal)} unit="g" icon="fish-outline" />
           <StatCard label="Current Weight" value={profile.weight} unit="kg" icon="barbell-outline" />
           <StatCard label="Goal Weight" value={profile.goalWeight ? profile.goalWeight : 'N/A'} unit="kg" icon="flag-outline" />
        </div>

        <Card>
            <CardHeader>
                <h3 className="font-semibold text-lg">Your Details</h3>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Age</label>
                                <input type="number" name="age" value={formData.age} onChange={handleChange} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Height (cm)</label>
                                <input type="number" name="height" value={formData.height} onChange={handleChange} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Weight (kg)</label>
                                <input type="number" name="weight" step="0.1" value={formData.weight} onChange={handleChange} className={inputClass} />
                            </div>
                             <div>
                                <label className={labelClass}>Goal Weight (kg)</label>
                                <input type="number" name="goalWeight" step="0.1" value={formData.goalWeight || ''} onChange={handleChange} className={inputClass} placeholder="e.g., 70" />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Activity Level</label>
                            <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className={inputClass}>
                                {ACTIVITY_LEVEL_OPTIONS.map(opt => (
                                    <option key={opt.label} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Fitness Goal (for automatic calculation)</label>
                            <select name="goal" value={formData.goal} onChange={handleChange} className={inputClass}>
                                {FITNESS_GOAL_OPTIONS.map(opt => (
                                    <option key={opt.label} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                        <div>
                            <label className={labelClass}>Goal Calculation</label>
                            <div className="flex gap-4 mt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="goalType" value="auto" checked={formData.goalType === 'auto'} onChange={handleChange} className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <span>Automatic</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="goalType" value="custom" checked={formData.goalType === 'custom'} onChange={handleChange} className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <span>Custom</span>
                                </label>
                            </div>
                        </div>

                        {formData.goalType === 'custom' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div>
                                    <label className={labelClass}>Calorie Goal (kcal)</label>
                                    <input type="number" name="customCalorieGoal" value={formData.customCalorieGoal || ''} onChange={handleChange} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Protein Goal (g)</label>
                                    <input type="number" name="customProteinGoal" value={formData.customProteinGoal || ''} onChange={handleChange} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Carbs Goal (g)</label>
                                    <input type="number" name="customCarbsGoal" value={formData.customCarbsGoal || ''} onChange={handleChange} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Fat Goal (g)</label>
                                    <input type="number" name="customFatGoal" value={formData.customFatGoal || ''} onChange={handleChange} className={inputClass} />
                                </div>
                            </div>
                        )}
                    </div>
                    
                     <button 
                        type="submit" 
                        disabled={isSaving}
                        className={`w-full p-2 rounded-md font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
                            isSaved ? 'bg-green-500' : 'bg-primary-600 hover:bg-primary-700'
                        } ${isSaving ? 'cursor-not-allowed bg-primary-400' : ''}`}
                    >
                        {isSaving && <Icon name="sync-outline" className="animate-spin w-5 h-5" />}
                        {isSaving ? 'Saving...' : (isSaved ? 'Saved!' : 'Update Profile')}
                    </button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
};