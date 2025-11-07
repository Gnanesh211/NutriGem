import { GoogleGenAI, Type } from '@google/genai';
import { NutritionData, ProfileData, FitnessGoal } from '../types';

// Fix: Initialize GoogleGenAI client directly with process.env.API_KEY as per coding guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const nutritionSchema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: 'The common name of the food item.',
    },
    calories: {
      type: Type.NUMBER,
      description: 'Total calories for the specified quantity.',
    },
    protein: {
      type: Type.NUMBER,
      description: 'Grams of protein for the specified quantity.',
    },
    carbohydrates: {
      type: Type.NUMBER,
      description: 'Grams of carbohydrates for the specified quantity.',
    },
    fat: {
      type: Type.NUMBER,
      description: 'Grams of fat for the specified quantity.',
    },
  },
  required: ['name', 'calories', 'protein', 'carbohydrates', 'fat'],
};

export const getNutritionInfo = async (foodQuery: string, quantity: number): Promise<NutritionData> => {
  try {
    const prompt = `Provide the nutritional information for ${quantity} grams of ${foodQuery}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: nutritionSchema,
      },
    });

    const jsonString = response.text.trim();
    const nutritionData = JSON.parse(jsonString) as NutritionData;
    
    return nutritionData;
  } catch (error) {
    console.error('Error fetching nutrition data from Gemini API:', error);
    throw new Error('Failed to retrieve nutritional information. The food might not be recognized.');
  }
};

export const getHealthTip = async (profile: ProfileData): Promise<string> => {
  try {
    const goalMap = {
      [FitnessGoal.Lose]: 'lose weight',
      [FitnessGoal.Maintain]: 'maintain weight',
      [FitnessGoal.Gain]: 'gain weight',
    };
    const goalText = goalMap[profile.goal];

    const prompt = `Based on a user who is ${profile.height} cm tall, weighs ${profile.weight} kg, and has a goal to ${goalText}, provide a short, encouraging, and helpful nutrition or wellness tip. Keep it to 2-3 sentences. Do not give medical advice. Start the response directly with the tip itself, without any introductory phrases like "Here's a tip:".`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error('Error fetching health tip from Gemini API:', error);
    throw new Error('Could not get a health tip at this moment. Please try again later.');
  }
};
