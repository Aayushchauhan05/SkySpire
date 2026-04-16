import { create } from 'zustand';
import axios from 'axios';

// Assuming your backend URL is set here, fallback to network IP for emulator testing
const apiURL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.9:3000/api';

export interface CategoryScore {
  slug: string;
  displayName: string;
  entryCount: number;
}

export interface LexiconEntry {
  _id: string;
  term: string;
  translation: string;
  definition: string;
  example?: string;
  notes?: string;
  audioUrl?: string;
  isFree?: boolean;
  level: string;
  category: string;
  topic: string;
}

export interface LexiconQuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'translation';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface LexiconState {
  categories: CategoryScore[];
  topics: string[];
  entries: LexiconEntry[];
  quizQuestions: LexiconQuizQuestion[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: (language: string) => Promise<void>;
  fetchTopics: (language: string, category: string, level: string) => Promise<void>;
  fetchEntries: (language: string, category: string, level: string, topic: string) => Promise<void>;
  generateQuiz: (language: string, category: string, level: string, topic: string) => Promise<void>;
  fetchDueReviews: (userId: string) => Promise<void>;
  submitGrade: (userId: string, lexiconEntryId: string, grade: number) => Promise<void>;
}

export const useLexiconStore = create<LexiconState>((set) => ({
  categories: [],
  topics: [],
  entries: [],
  quizQuestions: [],
  isLoading: false,
  error: null,

  fetchCategories: async (language: string) => {
    set({ isLoading: true, error: null });
    try {
      const dbLang = { french: 'fr', spanish: 'es', english: 'en', german: 'de' }[language.toLowerCase()] || language.toLowerCase();
      const { data } = await axios.get(`${apiURL}/lexicon/categories?language=${dbLang}`);
      set({ categories: data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchTopics: async (language: string, category: string, level: string) => {
    set({ isLoading: true, error: null });
    try {
      const dbLang = { french: 'fr', spanish: 'es', english: 'en', german: 'de' }[language.toLowerCase()] || language.toLowerCase();
      const { data } = await axios.get(`${apiURL}/lexicon/topics?language=${dbLang}&category=${category}&level=${level}`);
      set({ topics: data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchEntries: async (language: string, category: string, level: string, topic: string) => {
    set({ isLoading: true, error: null });
    try {
      const dbLang = { french: 'fr', spanish: 'es', english: 'en', german: 'de' }[language.toLowerCase()] || language.toLowerCase();
      const { data } = await axios.get(`${apiURL}/lexicon/entries?language=${dbLang}&category=${category}&level=${level}&topic=${topic}`);
      set({ entries: data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  generateQuiz: async (language: string, category: string, level: string, topic: string) => {
    set({ isLoading: true, error: null });
    try {
      const dbLang = { french: 'fr', spanish: 'es', english: 'en', german: 'de' }[language.toLowerCase()] || language.toLowerCase();
      const { data } = await axios.get(`${apiURL}/lexicon/quiz?language=${dbLang}&category=${category}&level=${level}&topic=${topic}`);
      set({ quizQuestions: data.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchDueReviews: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Re-using entries array to hold due reviews
      const { data } = await axios.get(`${apiURL}/revision/due?userId=${userId}`);
      set({ entries: data.data || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  submitGrade: async (userId: string, lexiconEntryId: string, grade: number) => {
    try {
      await axios.post(`${apiURL}/revision/grade`, { userId, lexiconEntryId, grade });
      // Remove from entries list gracefully
      set(state => ({
         entries: state.entries.filter(e => e._id !== lexiconEntryId)
      }));
    } catch (err: any) {
      console.error('Failed to submit grade:', err.message);
    }
  }
}));
