import { create } from 'zustand';

// Use local network IP if testing on real device, or localhost for simulator.
const API_URL = 'http://192.168.1.9:3000/api/grammar';
const DEV_USER_ID = 'dev_user_123'; // Mock user id

export interface GrammarBook {
  _id: string;
  title: string;
  authors: string;
  edition: string;
  language: string;
  target_language: string;
  total_pages: number;
  total_chapters: number;
}

export interface GrammarPart {
  _id: string;
  book_id: string;
  title: string;
  description: string;
  order: number;
  chapter_range: number[];
}

export interface GrammarChapter {
  _id: string;
  book_id: string;
  part_id: string;
  chapter_number: number;
  title: string;
  slug: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  page_start?: number;
  page_end?: number;
  total_pages?: number;
  word_count?: number;
  section_count?: number;
  example_count?: number;
  summary?: string;
}

interface UserProgress {
  user_id: string;
  chapter_id: string;
  section_id?: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score: number;
  completed_at?: Date;
}

interface GrammarState {
  books: GrammarBook[];
  parts: GrammarPart[];
  chapters: GrammarChapter[];
  progress: Record<string, UserProgress[]>; // Keyed by chapterId
  activeFilter: {
    bookId: string | null;
    partId: string | null;
    difficulty: string | null;
    tag: string | null;
    search: string;
  };
  fetchBooks: () => Promise<void>;
  fetchParts: (bookId?: string) => Promise<void>;
  fetchChapters: (partId?: string, filters?: any) => Promise<void>;
  fetchProgress: () => Promise<void>;
  markSectionComplete: (chapterId: string, sectionId: string) => Promise<void>;
  updateChapterProgress: (chapterId: string, status: 'not_started' | 'in_progress' | 'completed') => Promise<void>;
  setFilter: (filter: Partial<GrammarState['activeFilter']>) => void;
}

export const useGrammarStore = create<GrammarState>((set, get) => ({
  books: [],
  parts: [],
  chapters: [],
  progress: {},
  activeFilter: {
    bookId: null,
    partId: null,
    difficulty: null,
    tag: null,
    search: '',
  },

  fetchBooks: async () => {
    // Optimization: Don't re-fetch if already loaded
    if (get().books.length > 0) return;
    
    try {
      console.log(`[Store] Fetching books: ${API_URL}/books`);
      const res = await fetch(`${API_URL}/books`);
      if (!res.ok) return;
      const data = await res.json();
      set({ books: data });
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  },

  fetchParts: async (bookId) => {
    // Optimization: Only re-fetch if bookId changed or parts are empty
    const currentParts = get().parts;
    const isSameBook = currentParts.length > 0 && (!bookId || currentParts[0].book_id === bookId);
    
    if (isSameBook) return;

    // Clear existing parts while fetching to show loading state
    set({ parts: [] });

    try {
      const url = bookId ? `${API_URL}/parts?bookId=${bookId}` : `${API_URL}/parts`;
      console.log(`[Store] Fetching parts: ${url}`);
      const res = await fetch(url);
      if (!res.ok) {
        set({ parts: [] });
        return;
      }
      const data = await res.json();
      set({ parts: data });
    } catch (error) {
      console.error('Error fetching parts:', error);
      set({ parts: [] });
    }
  },

  fetchChapters: async (partId, filters = {}) => {
    // Clear chapters to trigger loading state in UI
    set({ chapters: [] });
    
    try {
      let url = partId ? `${API_URL}/parts/${partId}/chapters` : `${API_URL}/search`;
      const params = new URLSearchParams();
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.tag) params.append('tag', filters.tag);
      if (filters.search) params.append('search', filters.search);
      if (filters.search && !partId) params.append('q', filters.search); // global search

      url += `?${params.toString()}`;

      console.log(`[Store] Fetching chapters: ${url}`);
      const res = await fetch(url);
      if (!res.ok) {
        const text = await res.text();
        console.error(`FetchChapters Error [${res.status}]:`, text);
        return;
      }
      const data = await res.json();
      // If it's a search endpoint, chapters are returned in data.chapters
      set({ chapters: data.chapters || data });
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  },

  fetchProgress: async () => {
    try {
      console.log(`[Store] Fetching progress: ${API_URL}/progress/${DEV_USER_ID}`);
      const res = await fetch(`${API_URL}/progress/${DEV_USER_ID}`);
      if (!res.ok) {
        const text = await res.text();
        console.error(`FetchProgress Error [${res.status}]:`, text);
        return;
      }
      const data = await res.json();
      const progressMap: Record<string, UserProgress[]> = {};
      data.forEach((p: UserProgress) => {
        if (!progressMap[p.chapter_id]) {
          progressMap[p.chapter_id] = [];
        }
        progressMap[p.chapter_id].push(p);
      });
      set({ progress: progressMap });
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  },

  markSectionComplete: async (chapterId, sectionId) => {
    try {
      await fetch(`${API_URL}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: DEV_USER_ID, chapterId, sectionId, status: 'completed' })
      });
      get().fetchProgress();
    } catch (error) {
      console.error('Error marking section complete:', error);
    }
  },

  updateChapterProgress: async (chapterId, status) => {
    try {
      await fetch(`${API_URL}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: DEV_USER_ID, chapterId, status })
      });
      get().fetchProgress();
    } catch (error) {
      console.error('Error updating chapter progress:', error);
    }
  },

  setFilter: (filter) => {
    set((state) => ({ activeFilter: { ...state.activeFilter, ...filter } }));
  }
}));
