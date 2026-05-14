import { create } from 'zustand';
import type { FlashCard, MockSession, MockMode } from '../types';
import { initialFlashcards } from '../data/flashcards';

function loadLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`career-os-${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function saveLS(key: string, data: unknown) {
  localStorage.setItem(`career-os-${key}`, JSON.stringify(data));
}

interface InterviewState {
  cards: FlashCard[];
  sessions: MockSession[];
  currentMode: MockMode;
  currentCardIndex: number;
  isFlipped: boolean;
  filterCategory: string;

  setMode: (m: MockMode) => void;
  setFilterCategory: (c: string) => void;
  flipCard: () => void;
  nextCard: () => void;
  prevCard: () => void;
  rateCard: (cardId: string, rating: number) => void;
  addCard: (c: FlashCard) => void;
  updateCard: (id: string, updates: Partial<FlashCard>) => void;
  deleteCard: (id: string) => void;
  addSession: (s: MockSession) => void;
  getFilteredCards: () => FlashCard[];
  getCategories: () => string[];
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  cards: loadLS('flashcards', initialFlashcards),
  sessions: loadLS('mockSessions', [] as MockSession[]),
  currentMode: 'flashcard',
  currentCardIndex: 0,
  isFlipped: false,
  filterCategory: '',

  setMode: (m) => set({ currentMode: m, currentCardIndex: 0, isFlipped: false }),
  setFilterCategory: (c) => set({ filterCategory: c, currentCardIndex: 0, isFlipped: false }),

  flipCard: () => set({ isFlipped: !get().isFlipped }),

  nextCard: () => {
    const filtered = get().getFilteredCards();
    if (filtered.length === 0) return;
    const next = (get().currentCardIndex + 1) % filtered.length;
    set({ currentCardIndex: next, isFlipped: false });
  },

  prevCard: () => {
    const filtered = get().getFilteredCards();
    if (filtered.length === 0) return;
    const prev = (get().currentCardIndex - 1 + filtered.length) % filtered.length;
    set({ currentCardIndex: prev, isFlipped: false });
  },

  rateCard: (cardId, rating) => {
    const cards = get().cards.map((c) => {
      if (c.id !== cardId) return c;
      const newMastery = Math.min(100, Math.max(0, c.mastery + rating));
      return {
        ...c,
        mastery: newMastery,
        lastReviewed: new Date().toISOString().slice(0, 10),
        reviewCount: c.reviewCount + 1,
      };
    });
    set({ cards });
    saveLS('flashcards', cards);
  },

  addCard: (c) => {
    const cards = [...get().cards, c];
    set({ cards });
    saveLS('flashcards', cards);
  },

  updateCard: (id, updates) => {
    const cards = get().cards.map((c) => (c.id === id ? { ...c, ...updates } : c));
    set({ cards });
    saveLS('flashcards', cards);
  },

  deleteCard: (id) => {
    const cards = get().cards.filter((c) => c.id !== id);
    set({ cards, currentCardIndex: 0 });
    saveLS('flashcards', cards);
  },

  addSession: (s) => {
    const sessions = [...get().sessions, s];
    set({ sessions });
    saveLS('mockSessions', sessions);
  },

  getFilteredCards: () => {
    const { cards, filterCategory } = get();
    return filterCategory
      ? cards.filter((c) => c.category.startsWith(filterCategory))
      : cards;
  },

  getCategories: () => {
    const cats = new Set(get().cards.map((c) => c.category.split('/')[0]));
    return Array.from(cats).sort();
  },
}));
