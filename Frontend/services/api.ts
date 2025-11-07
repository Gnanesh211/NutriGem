// services/api.ts
import { DailyLog, ProfileData, User, WeightEntry, AuthResponse } from '../types';

const API_URL = 'http://localhost:5000/api'; // backend URL

// --- Auth API ---

export const apiLogin = async (username: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
    });
    const data: AuthResponse = await res.json();
    if (data.success && data.user) {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
    }
    return data;
};

export const apiSignup = async (username: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
    });
    const data: AuthResponse = await res.json();
    if (data.success && data.user) {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
    }
    return data;
};

export const apiLogout = async (): Promise<void> => {
    localStorage.removeItem('currentUser');
};

// --- Check Current User (for session) ---
export const apiCheckCurrentUser = async (): Promise<User | null> => {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
};

// --- Fetch User Data ---
export interface UserData {
    profile: ProfileData;
    dailyLog: DailyLog;
    waterIntake: number;
    weightLog: WeightEntry[];
}

export const apiFetchUserData = async (username: string): Promise<UserData> => {
    const res = await fetch(`${API_URL}/user/${username}`);
    return res.json();
};

// --- Update Profile ---
export const apiUpdateProfile = async (username: string, profile: ProfileData): Promise<ProfileData> => {
    const res = await fetch(`${API_URL}/user/${username}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
    });
    return res.json();
};

// --- Update Daily Log ---
export const apiUpdateDailyLog = async (username: string, dailyLog: DailyLog): Promise<DailyLog> => {
    const res = await fetch(`${API_URL}/user/${username}/dailylog`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dailyLog),
    });
    return res.json();
};

// --- Update Water Intake ---
export const apiUpdateWaterIntake = async (username: string, waterIntake: number): Promise<number> => {
    const res = await fetch(`${API_URL}/user/${username}/water`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ waterIntake }),
    });
    return res.json();
};

// --- Update Weight Log ---
export const apiUpdateWeightLog = async (username: string, weightLog: WeightEntry[]): Promise<WeightEntry[]> => {
    const res = await fetch(`${API_URL}/user/${username}/weightlog`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weightLog }),
    });
    return res.json();
};
