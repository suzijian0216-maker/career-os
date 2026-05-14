import { create } from 'zustand';
import type { Theme, Tab } from '../types';

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  tabs: Tab[];
  activeTab: string;

  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  toggleSidebar: () => void;
  openTab: (tab: Tab) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
}

const savedTheme = (localStorage.getItem('career-os-theme') as Theme) || 'geek';

export const useUIStore = create<UIState>((set, get) => ({
  theme: savedTheme,
  sidebarOpen: true,
  tabs: [
    { id: 'learning', label: '技能锻造台', icon: '🔧', active: true },
    { id: 'interview', label: '面试演武场', icon: '🎯', active: false },
  ],
  activeTab: 'learning',

  toggleTheme: () => {
    const next = get().theme === 'geek' ? 'finance' : 'geek';
    localStorage.setItem('career-os-theme', next);
    document.documentElement.setAttribute('data-theme', next);
    set({ theme: next });
  },

  setTheme: (t) => {
    localStorage.setItem('career-os-theme', t);
    document.documentElement.setAttribute('data-theme', t);
    set({ theme: t });
  },

  toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),

  openTab: (tab) => {
    const { tabs } = get();
    const exists = tabs.find((t) => t.id === tab.id);
    if (exists) {
      set({
        tabs: tabs.map((t) => ({ ...t, active: t.id === tab.id })),
        activeTab: tab.id,
      });
    } else {
      set({
        tabs: [...tabs.map((t) => ({ ...t, active: false })), { ...tab, active: true }],
        activeTab: tab.id,
      });
    }
  },

  closeTab: (id) => {
    const { tabs, activeTab } = get();
    const filtered = tabs.filter((t) => t.id !== id);
    if (filtered.length === 0) return;
    if (activeTab === id) {
      filtered[filtered.length - 1].active = true;
      set({ tabs: filtered, activeTab: filtered[filtered.length - 1].id });
    } else {
      set({ tabs: filtered });
    }
  },

  setActiveTab: (id) =>
    set({
      tabs: get().tabs.map((t) => ({ ...t, active: t.id === id })),
      activeTab: id,
    }),
}));

// 初始化主题
document.documentElement.setAttribute('data-theme', savedTheme);
