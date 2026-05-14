import { create } from 'zustand';
import { loadLS, saveLS, generateId } from '../utils/storage';
import type { Countdown, Achievement } from '../types';

interface TodoItem {
  id: string;
  content: string;
  done: boolean;
  date: string;
  source: string;  // "auto" | "manual"
}

const defaultCountdowns: Countdown[] = [
  { id: 'cd-1', name: '北大入学', targetDate: '2026-09-01', color: '#2563eb' },
  { id: 'cd-2', name: '秋招开始', targetDate: '2028-09-01', color: '#f59e0b' },
  { id: 'cd-3', name: '国考笔试', targetDate: '2028-11-25', color: '#dc2626' },
  { id: 'cd-4', name: '毕业答辩', targetDate: '2029-06-01', color: '#0d9488' },
];

const defaultAchievements: Achievement[] = [
  { id: 'ach-1', name: '编程启程', description: '完成第一道 LeetCode 题目', icon: '💻', condition: '刷题 >= 1' },
  { id: 'ach-2', name: '百题斩', description: '累计刷题 100 道', icon: '⚔️', condition: '刷题 >= 100' },
  { id: 'ach-3', name: 'Python 入门', description: 'Python 技能达到 30 分', icon: '🐍', condition: 'Python >= 30' },
  { id: 'ach-4', name: '机器学习入门', description: 'ML 技能达到 40 分', icon: '🤖', condition: 'ML >= 40' },
  { id: 'ach-5', name: 'LLM 实践者', description: 'LLM 技能达到 50 分', icon: '🧠', condition: 'LLM >= 50' },
  { id: 'ach-6', name: '第一段实习', description: '获得第一段实习 offer', icon: '🎉', condition: '实习 offer' },
  { id: 'ach-7', name: '百天坚持', description: '学习满 100 天', icon: '💯', condition: '天数 >= 100' },
  { id: 'ach-8', name: '千时磨砺', description: '累计学习 1000 小时', icon: '⏰', condition: '时长 >= 1000' },
  { id: 'ach-9', name: '面试达人', description: '完成 50 次 Mock 面试', icon: '🎤', condition: 'Mock >= 50' },
  { id: 'ach-10', name: '全栈项目', description: '完成第一个 LLM 应用项目', icon: '🚀', condition: '项目完成' },
];

interface WarRoomState {
  todos: TodoItem[];
  countdowns: Countdown[];
  achievements: Achievement[];

  addTodo: (content: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  getTodayTodos: () => TodoItem[];
  getDoneCount: () => number;

  addCountdown: (c: Omit<Countdown, 'id'>) => void;
  removeCountdown: (id: string) => void;
  getDaysUntil: (targetDate: string) => number;

  checkAchievements: (stats: { lc: number; days: number; minutes: number; mockCount: number; python: number; ml: number; llm: number; hasProject: boolean }) => Achievement[];
}

export const useWarRoomStore = create<WarRoomState>((set, get) => ({
  todos: loadLS('todos', [] as TodoItem[]),
  countdowns: loadLS('countdowns', defaultCountdowns),
  achievements: loadLS('achievements', defaultAchievements),

  addTodo: (content) => {
    const todo: TodoItem = { id: generateId(), content, done: false, date: new Date().toISOString().slice(0, 10), source: 'manual' };
    const todos = [...get().todos, todo];
    set({ todos });
    saveLS('todos', todos);
  },

  toggleTodo: (id) => {
    const todos = get().todos.map((t) => t.id === id ? { ...t, done: !t.done } : t);
    set({ todos });
    saveLS('todos', todos);
  },

  removeTodo: (id) => {
    const todos = get().todos.filter((t) => t.id !== id);
    set({ todos });
    saveLS('todos', todos);
  },

  getTodayTodos: () => {
    const today = new Date().toISOString().slice(0, 10);
    return get().todos.filter((t) => t.date === today || !t.done);
  },

  getDoneCount: () => get().todos.filter((t) => t.done).length,

  addCountdown: (c) => {
    const countdowns = [...get().countdowns, { ...c, id: generateId() }];
    set({ countdowns });
    saveLS('countdowns', countdowns);
  },

  removeCountdown: (id) => {
    const countdowns = get().countdowns.filter((c) => c.id !== id);
    set({ countdowns });
    saveLS('countdowns', countdowns);
  },

  getDaysUntil: (targetDate) => {
    const target = new Date(targetDate);
    const now = new Date();
    return Math.ceil((target.getTime() - now.getTime()) / 86400000);
  },

  checkAchievements: (stats) => {
    const updated = get().achievements.map((a) => {
      if (a.unlockedAt) return a;
      let unlocked = false;
      if (a.id === 'ach-1' && stats.lc >= 1) unlocked = true;
      if (a.id === 'ach-2' && stats.lc >= 100) unlocked = true;
      if (a.id === 'ach-3' && stats.python >= 30) unlocked = true;
      if (a.id === 'ach-4' && stats.ml >= 40) unlocked = true;
      if (a.id === 'ach-5' && stats.llm >= 50) unlocked = true;
      if (a.id === 'ach-7' && stats.days >= 100) unlocked = true;
      if (a.id === 'ach-8' && stats.minutes >= 60000) unlocked = true;
      if (a.id === 'ach-9' && stats.mockCount >= 50) unlocked = true;
      if (a.id === 'ach-10' && stats.hasProject) unlocked = true;
      if (unlocked) return { ...a, unlockedAt: new Date().toISOString().slice(0, 10) };
      return a;
    });
    const hasNew = updated.some((a, i) => a.unlockedAt && !get().achievements[i].unlockedAt);
    if (hasNew) {
      set({ achievements: updated });
      saveLS('achievements', updated);
    }
    return updated.filter((a) => a.unlockedAt && !get().achievements.find((oa) => oa.id === a.id)?.unlockedAt);
  },
}));
