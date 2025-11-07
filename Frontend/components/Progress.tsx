import React, { useState, useEffect } from 'react';
import { NutritionStore } from '../hooks/useNutritionStore';
import { Card, CardContent, CardHeader } from './common/Card';
// Fix: Import PieChart, Pie, and Cell from recharts.
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Legend, Area, ReferenceLine, PieChart, Pie, Cell } from 'recharts';
import { Icon } from './common/Icon';
import { getHealthTip } from '../services/geminiService';

const MacroPieChart: React.FC<{ store: NutritionStore }> = ({ store }) => {
  const { totals } = store;
  const data = [
    { name: 'Protein', value: totals.protein },
    { name: 'Carbs', value: totals.carbs },
    { name: 'Fat', value: totals.fat },
  ].filter(item => item.value > 0);

  const COLORS = ['#3b82f6', '#f97316', '#eab308'];
  
  const totalMacros = totals.protein + totals.carbs + totals.fat;

  if (totalMacros === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Icon name="pie-chart-outline" className="w-16 h-16 mb-4" />
            <p>Log some food to see your macro breakdown.</p>
        </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      {/* Fix: Use PieChart instead of AreaChart for a pie chart. */}
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          // Fix: Explicitly type the label props to `any` to resolve type errors from the recharts library.
          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
            const RADIAN = Math.PI / 180;
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
            return (
              <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            );
          }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `${value.toFixed(1)}g`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

const WeightTracker: React.FC<{ store: NutritionStore }> = ({ store }) => {
    const { weightLog, addWeightEntry, profile } = store;
    const [currentWeight, setCurrentWeight] = useState(profile.weight.toString());
    const [isLogging, setIsLogging] = useState(false);

    useEffect(() => {
        setCurrentWeight(profile.weight.toString());
    }, [profile.weight]);

    const handleAddWeight = async (e: React.FormEvent) => {
        e.preventDefault();
        const weight = parseFloat(currentWeight);
        if (!isNaN(weight) && weight > 0) {
            setIsLogging(true);
            await addWeightEntry(weight);
            setIsLogging(false);
        }
    }

    const startWeight = weightLog.length > 0 ? weightLog[0].weight : null;
    const latestWeight = weightLog.length > 0 ? weightLog[weightLog.length - 1].weight : null;
    const weightChange = startWeight && latestWeight ? latestWeight - startWeight : 0;

    const changeColor = weightChange === 0 ? 'text-gray-500' : weightChange < 0 ? 'text-green-500' : 'text-red-500';
    const goalWeight = profile.goalWeight;


    return (
        <Card>
            <CardHeader>
                <h3 className="font-semibold text-lg">Weight Tracker</h3>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleAddWeight} className="flex flex-col sm:flex-row gap-2 mb-6">
                    <input 
                        type="number"
                        step="0.1"
                        value={currentWeight}
                        onChange={e => setCurrentWeight(e.target.value)}
                        className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2"
                        placeholder="Enter current weight"
                    />
                    <button 
                        type="submit" 
                        disabled={isLogging}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                         <Icon name="add-outline" />
                        {isLogging ? 'Logging...' : 'Log Weight'}
                    </button>
                </form>

                 <div className="grid grid-cols-3 gap-4 text-center mb-6">
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Start</p>
                        <p className="font-bold text-lg">{startWeight ? `${startWeight}kg` : 'N/A'}</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Current</p>
                        <p className="font-bold text-lg">{latestWeight ? `${latestWeight}kg` : 'N/A'}</p>
                    </div>
                     <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Change</p>
                        <p className={`font-bold text-lg ${changeColor}`}>
                            {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)}kg
                        </p>
                    </div>
                </div>

                {weightLog.length < 2 ? (
                     <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                        <Icon name="analytics-outline" className="w-16 h-16 mb-4" />
                        <p className="text-center">Log your weight for at least two days to see your progress chart.</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={weightLog} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                             <defs>
                                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(value) => `${value}kg`} />
                            {goalWeight && <ReferenceLine y={goalWeight} label={{ value: `Goal: ${goalWeight}kg`, position: 'insideTopLeft' }} stroke="red" strokeDasharray="3 3" />}
                            <Area type="monotone" dataKey="weight" stroke="#10b981" fillOpacity={1} fill="url(#colorWeight)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
};

const AIHealthTipCard: React.FC<{ store: NutritionStore }> = ({ store }) => {
    const [tip, setTip] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetTip = async () => {
        if (!store.profile) return;
        setIsLoading(true);
        setError(null);
        setTip(null);
        try {
            const result = await getHealthTip(store.profile);
            setTip(result);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <h3 className="font-semibold text-lg">AI Health Tip</h3>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center">
                {isLoading ? (
                    <Icon name="sync-outline" className="animate-spin w-12 h-12 text-primary-500" />
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : tip ? (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{tip}</p>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <Icon name="sparkles-outline" className="w-16 h-16 text-primary-400" />
                        <p className="text-gray-500">Get a personalized wellness tip from Gemini based on your profile.</p>
                    </div>
                )}
                <button 
                    onClick={handleGetTip} 
                    disabled={isLoading}
                    className="mt-6 bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Generating...' : (tip ? 'Get Another Tip' : 'Get Tip')}
                </button>
            </CardContent>
        </Card>
    );
};


interface ProgressProps {
  store: NutritionStore;
}

export const Progress: React.FC<ProgressProps> = ({ store }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Progress</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-lg">Macronutrient Breakdown</h3>
            </CardHeader>
            <CardContent>
              <MacroPieChart store={store} />
            </CardContent>
          </Card>
          <AIHealthTipCard store={store} />
      </div>
       <WeightTracker store={store} />
    </div>
  );
};