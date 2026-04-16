import { create } from 'zustand';

// Use local network IP if testing on real device, or localhost for simulator.
const API_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.9:3000/api') + '/grammar';
const DEV_USER_ID = 'dev_user_123'; // Mock user id

// Module-level flags to prevent duplicate concurrent fetches from multiple screens
let _fetchingBooks = false;
let _fetchingProgress = false;
const _fetchingPartsUrls = new Set<string>(); // tracks inflight part URLs

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

export interface GrammarIndexEntry {
  letter: string;
  keyword: string;
  topicTitle: string;
  sectionId: string;
  chapterTitle: string;
  partTitle: string;
}

interface GrammarState {
  books: GrammarBook[];
  parts: GrammarPart[];
  chapters: GrammarChapter[];
  grammarIndex: GrammarIndexEntry[];
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
  fetchIndex: () => Promise<void>;
  fetchProgress: () => Promise<void>;
  markSectionComplete: (chapterId: string, sectionId: string) => Promise<void>;
  updateChapterProgress: (chapterId: string, status: 'not_started' | 'in_progress' | 'completed') => Promise<void>;
  setFilter: (filter: Partial<GrammarState['activeFilter']>) => void;
}

export const useGrammarStore = create<GrammarState>((set, get) => ({
  books: [],
  parts: [],
  chapters: [],
  grammarIndex: [],
  progress: {},
  activeFilter: {
    bookId: null,
    partId: null,
    difficulty: null,
    tag: null,
    search: '',
  },

  fetchIndex: async () => {
    if (get().grammarIndex.length > 0) return;
    try {
      const res = await fetch(`${API_URL}/index`);
      if (!res.ok) return;
      const data = await res.json();
      set({ grammarIndex: data });
    } catch (error) {
      console.error('Error fetching grammar index:', error);
    }
  },

  fetchBooks: async () => {
    // Dedup: skip if already loaded or a fetch is in flight
    if (get().books.length > 0 || _fetchingBooks) return;
    _fetchingBooks = true;
    try {
      console.log(`[Store] Fetching books: ${API_URL}/books`);
      const res = await fetch(`${API_URL}/books`);
      if (!res.ok) return;
      const raw = await res.text();
      const data = JSON.parse(raw);
      if (Array.isArray(data)) set({ books: data });
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      _fetchingBooks = false;
    }
  },

  fetchParts: async (bookId) => {
    // Optimization: Only re-fetch if bookId changed or parts are empty
    const currentParts = get().parts;
    const isSameBook = currentParts.length > 0 && (!bookId || currentParts[0].book_id === bookId);
    if (isSameBook) return;

    // Dedup: prevent concurrent fetches for the same URL
    const url = bookId ? `${API_URL}/parts?bookId=${bookId}` : `${API_URL}/parts`;
    if (_fetchingPartsUrls.has(url)) return;
    _fetchingPartsUrls.add(url);

    // Clear existing parts while fetching to show loading state
    set({ parts: [] });

    try {
      console.log(`[Store] Fetching parts: ${url}`);
      const res = await fetch(url);
      if (!res.ok) {
        set({ parts: [] });
        return;
      }
      const raw = await res.text();
      const data = JSON.parse(raw);
      if (Array.isArray(data)) set({ parts: data });
    } catch (error) {
      console.error('Error fetching parts:', error);
      set({ parts: [] });
    } finally {
      _fetchingPartsUrls.delete(url);
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
      const rawText = await res.text();
      console.log('[Chapters RAW response first 300 chars]:', rawText.substring(0, 300));
      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch (parseErr) {
        console.error('[Chapters JSON parse failed] Raw was:', rawText.substring(0, 300));
        return;
      }
      // If it's a search endpoint, chapters are returned in data.chapters
      set({ chapters: data.chapters || data });
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  },

  fetchProgress: async () => {
    // Dedup: skip if a fetch is already in flight
    if (_fetchingProgress) return;
    _fetchingProgress = true;
    try {
      console.log(`[Store] Fetching progress: ${API_URL}/progress/${DEV_USER_ID}`);
      const res = await fetch(`${API_URL}/progress/${DEV_USER_ID}`);
      if (!res.ok) {
        const text = await res.text();
        console.error(`FetchProgress Error [${res.status}]:`, text);
        return;
      }
      const raw = await res.text();
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) {
        console.warn('[Store] fetchProgress: unexpected response shape', raw.substring(0, 100));
        return;
      }
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
    } finally {
      _fetchingProgress = false;
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
