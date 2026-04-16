import { create } from 'zustand';
import axios from 'axios';
const apiURL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.9:3000/api';

export interface ChapterData {
  _id: string;
  order: number;
  title: string;
  topic?: string;
  isCompleted?: boolean;
  completedTabs?: string[];
}

export interface LearningPathData {
  _id: string;
  language: string;
  level: string;
  order: number;
  title: string;
  description: string;
  isLocked: boolean;
  chapters: ChapterData[];
}

interface CourseState {
  paths: LearningPathData[];
  currentChapter: any | null; // For detailed lesson view
  isLoading: boolean;
  error: string | null;
  fetchPaths: (language: string, userId?: string) => Promise<void>;
  fetchChapter: (chapterId: string, userId?: string) => Promise<void>;
  markTabComplete: (chapterId: string, tab: string, userId: string) => Promise<void>;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  paths: [],
  currentChapter: null,
  isLoading: false,
  error: null,

  fetchPaths: async (language, userId) => {
    set({ isLoading: true, error: null });
    try {
      const map: any = { french: 'fr', spanish: 'es', english: 'en', german: 'de', italian: 'it' };
      const langCode = map[language.toLowerCase()] || language.toLowerCase();
      let url = `${apiURL}/paths?language=${langCode}`;
      if (userId) url += `&userId=${userId}`;
      const { data } = await axios.get(url);
      set({ paths: data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchChapter: async (chapterId, userId) => {
    set({ isLoading: true, error: null });
    try {
      let url = `${apiURL}/chapters/${chapterId}`;
      if (userId) url += `?userId=${userId}`;
      const { data } = await axios.get(url);
      set({ currentChapter: data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  markTabComplete: async (chapterId, tab, userId) => {
    try {
      const { data } = await axios.post(`${apiURL}/chapters/${chapterId}/complete`, {
        userId,
        tab
      });
      // Optionally update current chapter's completedTabs locally
      const { currentChapter } = get();
      if (currentChapter && currentChapter._id === chapterId) {
         set({
            currentChapter: {
               ...currentChapter,
               completedTabs: data.data.progress.completedTabs
            }
         });
      }
    } catch (err: any) {
      console.error('Failed to mark tab complete:', err.message);
    }
  }
}));
