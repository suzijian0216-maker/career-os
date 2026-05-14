import { create } from 'zustand';
import type { RoadmapPhase, SkillNode, LeetCodeRecord, PomodoroSession } from '../types';
import { initialRoadmap, initialSkills } from '../data/roadmap';

function loadFromLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`career-os-${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToLS(key: string, data: unknown) {
  localStorage.setItem(`career-os-${key}`, JSON.stringify(data));
}

interface SkillState {
  roadmap: RoadmapPhase[];
  skills: SkillNode[];
  leetCode: LeetCodeRecord[];
  pomodoro: PomodoroSession[];
  startDate: string;

  toggleTask: (phaseId: string, taskId: string) => void;
  setSkillLevel: (id: string, level: number) => void;
  addLeetCodeRecord: (r: LeetCodeRecord) => void;
  addPomodoro: (p: PomodoroSession) => void;
  getDaysSinceStart: () => number;
  getTotalLeetCode: () => number;
  getTotalPomodoroMinutes: () => number;
  getOverallProgress: () => number;
}

export const useSkillStore = create<SkillState>((set, get) => ({
  roadmap: loadFromLS('roadmap', initialRoadmap),
  skills: loadFromLS('skills', initialSkills),
  leetCode: loadFromLS('leetcode', [] as LeetCodeRecord[]),
  pomodoro: loadFromLS('pomodoro', [] as PomodoroSession[]),
  startDate: loadFromLS('startDate', '2026-06-01'),

  toggleTask: (phaseId, taskId) => {
    const roadmap = get().roadmap.map((p) => {
      if (p.id !== phaseId) return p;
      const tasks = p.tasks.map((t) =>
        t.id === taskId ? { ...t, done: !t.done } : t
      );
      const allDone = tasks.every((t) => t.done);
      return { ...p, tasks, status: allDone ? 'done' : p.status };
    });
    set({ roadmap });
    saveToLS('roadmap', roadmap);
  },

  setSkillLevel: (id, level) => {
    const skills = get().skills.map((s) => {
      if (s.id !== id) return s;
      let stage = s.stage;
      if (level < 20) stage = 'outsider';
      else if (level < 40) stage = 'beginner';
      else if (level < 60) stage = 'practitioner';
      else if (level < 80) stage = 'proficient';
      else stage = 'master';
      return { ...s, level, stage, lastUpdated: new Date().toISOString().slice(0, 10) };
    });
    set({ skills });
    saveToLS('skills', skills);
  },

  addLeetCodeRecord: (r) => {
    const leetCode = [...get().leetCode, r];
    set({ leetCode });
    saveToLS('leetcode', leetCode);
  },

  addPomodoro: (p) => {
    const pomodoro = [...get().pomodoro, p];
    set({ pomodoro });
    saveToLS('pomodoro', pomodoro);
  },

  getDaysSinceStart: () => {
    const start = new Date(get().startDate);
    const now = new Date();
    return Math.max(0, Math.floor((now.getTime() - start.getTime()) / 86400000));
  },

  getTotalLeetCode: () => {
    return get().leetCode.reduce((sum, r) => sum + r.easy + r.medium + r.hard, 0);
  },

  getTotalPomodoroMinutes: () => {
    return get().pomodoro.reduce((sum, p) => sum + p.duration, 0);
  },

  getOverallProgress: () => {
    const total = get().roadmap.reduce((s, p) => s + p.tasks.length, 0);
    const done = get().roadmap.reduce((s, p) => s + p.tasks.filter((t) => t.done).length, 0);
    return total === 0 ? 0 : Math.round((done / total) * 100);
  },
}));
