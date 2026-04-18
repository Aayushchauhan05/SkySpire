import { create } from 'zustand';
import { useAppStore } from './useAppStore';

export interface ProgressItem {
  _id: string;
  user_id: string;
  module_chapter_id?: string;
  path_id?: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completedTabs: string[];
  score: number;
  completed_at?: string;
  last_visited_at?: string;
}

export interface UserStats {
  totalXP: number;
  streakCount: number;
  completedLessons: number;
  inProgressLessons: number;
  totalLessons: number;
  completionPercentage: number;
  dailyGoalMinutes: number;
  targetLanguage: string;
  proficiencyLevel: string;
  achievements: any[];
}

export interface NextLesson {
  chapterId: string;
  title: string;
  description: string;
  estimatedTime: number;
}

export interface ProgressState {
  // User Stats
  userStats: UserStats | null;
  nextLesson: NextLesson | null;
  allProgress: ProgressItem[];

  // Loading states
  isLoading: boolean;
  error: string | null;

  // API Base URL
  apiUrl: string;

  // Actions
  setApiUrl: (url: string) => void;
  fetchUserStats: (userId: string) => Promise<void>;
  fetchNextLesson: (userId: string) => Promise<void>;
  fetchAllProgress: (userId: string, itemType?: string) => Promise<void>;
  updateChapterProgress: (userId: string, chapterId: string, tab: string) => Promise<void>;
  updateModuleProgress: (userId: string, moduleId: string, status: string) => Promise<void>;
  markItemComplete: (userId: string, itemType: 'chapter' | 'module', itemId: string) => Promise<void>;
  getProgressByLanguage: (userId: string, language: string) => Promise<any>;
  setError: (error: string | null) => void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  userStats: null,
  nextLesson: null,
  allProgress: [],
  isLoading: false,
  error: null,
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.9:3000/api',

  setApiUrl: (url: string) => set({ apiUrl: url }),

  setError: (error: string | null) => set({ error }),

  fetchUserStats: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const apiUrl = get().apiUrl;
      const response = await fetch(`${apiUrl}/progress/stats/${userId}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to fetch stats');

      set({ userStats: data.data, isLoading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch stats';
      set({ error: errorMsg, isLoading: false });
    }
  },

  fetchNextLesson: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const apiUrl = get().apiUrl;
      const response = await fetch(`${apiUrl}/progress/next-lesson/${userId}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to fetch next lesson');

      set({ nextLesson: data.data, isLoading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch next lesson';
      set({ error: errorMsg, isLoading: false });
    }
  },

  fetchAllProgress: async (userId: string, itemType?: string) => {
    set({ isLoading: true, error: null });
    try {
      const apiUrl = get().apiUrl;
      const query = itemType ? `?userId=${userId}&itemType=${itemType}` : `?userId=${userId}`;
      const response = await fetch(`${apiUrl}/progress/items${query}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to fetch progress');

      set({ allProgress: data.data, isLoading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch progress';
      set({ error: errorMsg, isLoading: false });
    }
  },

  updateChapterProgress: async (userId: string, chapterId: string, tab: string) => {
    set({ isLoading: true, error: null });
    try {
      const apiUrl = get().apiUrl;
      const response = await fetch(`${apiUrl}/progress/chapter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, chapterId, tab })
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to update progress');

      // Update local progress
      set(state => ({
        allProgress: state.allProgress.map(p =>
          p.module_chapter_id === chapterId ? data.data.progress : p
        ) || [data.data.progress],
        isLoading: false
      }));

      // Refresh stats
      get().fetchUserStats(userId);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update progress';
      set({ error: errorMsg, isLoading: false });
    }
  },

  updateModuleProgress: async (userId: string, moduleId: string, status: string) => {
    set({ isLoading: true, error: null });
    try {
      const apiUrl = get().apiUrl;
      const response = await fetch(`${apiUrl}/progress/module`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, moduleId, status })
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to update module');

      set({ isLoading: false });
      get().fetchAllProgress(userId, 'modules');
      get().fetchUserStats(userId);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update module';
      set({ error: errorMsg, isLoading: false });
    }
  },

  markItemComplete: async (userId: string, itemType: 'chapter' | 'module', itemId: string) => {
    set({ isLoading: true, error: null });
    try {
      const apiUrl = get().apiUrl;
      const response = await fetch(`${apiUrl}/progress/mark-complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemType, itemId })
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to mark complete');

      set({ isLoading: false });
      get().fetchAllProgress(userId);
      get().fetchUserStats(userId);
      get().fetchNextLesson(userId);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to mark complete';
      set({ error: errorMsg, isLoading: false });
    }
  },

  getProgressByLanguage: async (userId: string, language: string) => {
    set({ isLoading: true, error: null });
    try {
      const apiUrl = get().apiUrl;
      const response = await fetch(`${apiUrl}/progress/language/${userId}/${language}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to fetch language progress');

      set({ isLoading: false });
      return data.data;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch language progress';
      set({ error: errorMsg, isLoading: false });
      return null;
    }
  }
}));
