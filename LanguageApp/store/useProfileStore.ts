import { create } from 'zustand';

export interface Achievement {
  badgeId: string;
  earnedAt: string;
}

export interface ProfileData {
  _id: string;
  user: string;
  name: string;
  targetLanguage: string;
  proficiencyLevel: string;
  dailyGoalMinutes: number;
  motivation: string;
  streakCount: number;
  streakShieldCount: number;
  achievements: Achievement[];
  lastLearnedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileState {
  // Profile data
  profile: ProfileData | null;
  isLoading: boolean;
  error: string | null;

  // API Base URL
  apiUrl: string;

  // Actions
  setApiUrl: (url: string) => void;
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<ProfileData>) => Promise<void>;
  updateProficiencyLevel: (userId: string, level: string) => Promise<void>;
  updateDailyGoal: (userId: string, minutes: number) => Promise<void>;
  getAchievements: (userId: string) => Promise<Achievement[]>;
  addAchievement: (userId: string, badgeId: string) => Promise<void>;
  updateStreak: (userId: string, increment?: boolean, useShield?: boolean) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.9:3000/api',

  setApiUrl: (url: string) => set({ apiUrl: url }),

  setError: (error: string | null) => set({ error }),

  fetchProfile: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const apiUrl = get().apiUrl;
      const response = await fetch(`${apiUrl}/profile/${userId}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');

      set({ profile: data.data, isLoading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch profile';
      set({ error: errorMsg, isLoading: false });
    }
  },

  updateProfile: async (userId: string, updates: Partial<ProfileData>) => {
    set({ isLoading: true, error: null });
    try {
      const apiUrl = get().apiUrl;
      const response = await fetch(`${apiUrl}/profile/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to update profile');

      set({ profile: data.data, isLoading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update profile';
      set({ error: errorMsg, isLoading: false });
    }
  },

  updateProficiencyLevel: async (userId: string, level: string) => {
    set({ isLoading: true, error: null });
    try {
      const apiUrl = get().apiUrl;
      const response = await fetch(`${apiUrl}/profile/${userId}/proficiency`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proficiencyLevel: level })
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to update level');

      set({ profile: data.data, isLoading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update level';
      set({ error: errorMsg, isLoading: false });
    }
  },

  updateDailyGoal: async (userId: string, minutes: number) => {
    set({ isLoading: true, error: null });
    try {
      const apiUrl = get().apiUrl;
      const response = await fetch(`${apiUrl}/profile/${userId}/daily-goal`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dailyGoalMinutes: minutes })
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to update goal');

      set({ profile: data.data, isLoading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update goal';
      set({ error: errorMsg, isLoading: false });
    }
  },

  getAchievements: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const apiUrl = get().apiUrl;
      const response = await fetch(`${apiUrl}/profile/${userId}/achievements`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to fetch achievements');

      set({ isLoading: false });
      return data.data.achievements;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch achievements';
      set({ error: errorMsg, isLoading: false });
      return [];
    }
  },

  addAchievement: async (userId: string, badgeId: string) => {
    set({ isLoading: true, error: null });
    try {
      const apiUrl = get().apiUrl;
      const response = await fetch(`${apiUrl}/profile/${userId}/achievements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ badgeId })
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to add achievement');

      set({ profile: data.data, isLoading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to add achievement';
      set({ error: errorMsg, isLoading: false });
    }
  },

  updateStreak: async (userId: string, increment?: boolean, useShield?: boolean) => {
    set({ isLoading: true, error: null });
    try {
      const apiUrl = get().apiUrl;
      const response = await fetch(`${apiUrl}/profile/${userId}/streak`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increment: increment !== false, useShield: useShield || false })
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to update streak');

      // Update local profile
      set(state => state.profile ? {
        profile: {
          ...state.profile,
          streakCount: data.data.streakCount,
          streakShieldCount: data.data.streakShieldCount
        },
        isLoading: false
      } : { isLoading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update streak';
      set({ error: errorMsg, isLoading: false });
    }
  }
}));
