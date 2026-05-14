// ============================================
// Career OS — 全局类型定义
// ============================================

// --- UI ---
export type Theme = 'geek' | 'finance';

export interface Tab {
  id: string;
  label: string;
  icon: string;
  active: boolean;
}

// --- 模块 3：学习追踪 ---
export type SkillStage = 'outsider' | 'beginner' | 'practitioner' | 'proficient' | 'master';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface SubTask {
  id: string;
  content: string;
  month: string;
  resources: string[];
}

export interface RoadmapTask {
  id: string;
  content: string;
  done: boolean;
  month: string;
  resources: string[];
}

export interface RoadmapPhase {
  id: string;
  name: string;
  period: string;
  status: 'done' | 'active' | 'future';
  tasks: RoadmapTask[];
}

export interface SkillNode {
  id: string;
  name: string;
  category: string;
  level: number;
  stage: SkillStage;
  lastUpdated: string;
  subSkills: { name: string; done: boolean }[];
}

export interface LeetCodeRecord {
  date: string;
  easy: number;
  medium: number;
  hard: number;
}

export interface PomodoroSession {
  date: string;
  duration: number;
  subject: string;
}

// --- 模块 5：面试 Mock ---
export type CardDifficulty = 'easy' | 'medium' | 'hard';
export type MockMode = 'flashcard' | 'timed' | 'chain';

export interface FlashCard {
  id: string;
  category: string;
  question: string;
  answer: string;
  hints: string[];
  followUps: string[];
  difficulty: CardDifficulty;
  mastery: number;
  lastReviewed: string;
  reviewCount: number;
  source: string;
}

export interface MockSession {
  id: string;
  date: string;
  mode: MockMode;
  targetCompany?: string;
  cardIds: string[];
  selfRating: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
}

// --- 模块 4 & 11 预置（后续阶段扩展） ---
export interface TargetCompany {
  id: string;
  name: string;
  tier: string;
  category: string;
  city: string;
  salaryRange: string;
  wlb: number;
  status: string;
  notes: string;
}

export interface Countdown {
  id: string;
  name: string;
  targetDate: string;
  color: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  condition: string;
}
