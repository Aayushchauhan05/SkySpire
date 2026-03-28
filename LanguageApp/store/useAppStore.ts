import { create } from 'zustand';

export interface AppState {
  // User Profile
  name: string;
  targetLanguage: string;
  cefrLevel: string;
  dailyGoalMinutes: number;
  motivation: string;
  
  // Gamification & Progress
  xp: number;
  streakDays: number;
  minutesStudiedToday: number;
  lastStudyDate: string; // ISO string to check streak logic
  completedChapters: string[]; // store chapter IDs
  
  // Lexicon Vault
  savedWords: { word: string; translation: string; category?: string }[];
  
  // Actions
  setUserProfile: (profile: Partial<AppState>) => void;
  addXP: (amount: number) => void;
  addStudyMinutes: (minutes: number) => void;
  checkAndUpdateStreak: () => void;
  unlockChapter: (chapterId: string) => void;
  saveWordToVault: (wordObj: { word: string; translation: string; category?: string }) => void;
  resetProgress: () => void;
}

export const useAppStore = create<AppState>()(
  (set, get) => ({
    name: 'Guest User',
    targetLanguage: 'Spanish',
    cefrLevel: 'A1',
    dailyGoalMinutes: 15,
    motivation: 'Personal',
    
    xp: 0,
    streakDays: 0,
    minutesStudiedToday: 0,
    lastStudyDate: new Date().toISOString(),
    completedChapters: [],
    savedWords: [],
    
    setUserProfile: (profile) => set((state) => ({ ...state, ...profile })),
    
    addXP: (amount) => set((state) => ({ xp: state.xp + amount })),
    
    addStudyMinutes: (minutes) => set((state) => {
      const now = new Date();
      const lastDate = new Date(state.lastStudyDate);
      
      // Reset daily minutes if it's a new day
      const isSameDay = now.toDateString() === lastDate.toDateString();
      
      return {
        minutesStudiedToday: isSameDay ? state.minutesStudiedToday + minutes : minutes,
        lastStudyDate: now.toISOString(),
      };
    }),
    
    checkAndUpdateStreak: () => set((state) => {
      const now = new Date();
      const lastDate = new Date(state.lastStudyDate);
      
      now.setHours(0, 0, 0, 0);
      lastDate.setHours(0, 0, 0, 0);
      
      const diffTime = now.getTime() - lastDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays === 1) {
         return { streakDays: state.streakDays + 1, lastStudyDate: new Date().toISOString() };
      } else if (diffDays > 1) {
         return { streakDays: 0, lastStudyDate: new Date().toISOString() };
      }
      return {}; 
    }),
    
    unlockChapter: (chapterId) => set((state) => ({
      completedChapters: [...new Set([...state.completedChapters, chapterId])]
    })),
    
    saveWordToVault: (wordObj) => set((state) => {
      if (state.savedWords.some(w => w.word === wordObj.word)) return state;
      return { savedWords: [...state.savedWords, wordObj] };
    }),
    
    resetProgress: () => set({
      xp: 0,
      streakDays: 0,
      minutesStudiedToday: 0,
      completedChapters: [],
      savedWords: []
    })
  })
);
