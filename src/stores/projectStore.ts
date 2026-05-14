import { create } from 'zustand';
import { loadLS, saveLS, generateId } from '../utils/storage';

export interface Project {
  id: string;
  name: string;
  tagline: string;
  background: string;
  techStack: string[];
  architecture: string;
  highlights: string[];
  adrs: { decision: string; alternatives: string[]; rationale: string }[];
  skillsUnlocked: string[];
  githubUrl: string;
  demoUrl: string;
  screenshots: string[];
  status: 'planned' | 'building' | 'done';
  completedAt: string;
}

const defaults: Project[] = [
  {
    id: 'fin-rag',
    name: '金融研报智能问答系统',
    tagline: '基于 RAG 的金融研究报告智能检索与问答',
    background: '金融研报数量庞大，分析师需要快速找到关键信息。本系统将研报向量化，通过自然语言提问，自动检索相关内容并生成回答。',
    techStack: ['Python', 'LangChain', 'ChromaDB', 'Qwen', 'FastAPI', 'Streamlit'],
    architecture: 'PDF解析 → 文本切割 → BGE Embedding → ChromaDB存储 → Query输入 → 向量检索 → Qwen生成回答 → Streamlit前端',
    highlights: ['支持 500+ 份研报的批量入库', '检索+生成端到端延迟 <3s', '支持多轮追问和上下文记忆', '精确引用原文段落'],
    adrs: [
      { decision: '选择 ChromaDB 而非 Pinecone', alternatives: ['Pinecone', 'Weaviate', 'FAISS'], rationale: '本地开发免费，轻量部署，足够支持万级文档规模。Pinecone 使用成本高且需要联网。' },
      { decision: 'LoRA 微调 Qwen 而非全量微调', alternatives: ['全量微调', 'Prompt Engineering'], rationale: '显存限制(24GB VRAM)，LoRA 在保持性能的同时大幅降低训练成本，推理时合并权重无额外开销。' },
    ],
    skillsUnlocked: ['sk-py', 'sk-llm', 'sk-ml'],
    githubUrl: 'https://github.com/',
    demoUrl: '',
    screenshots: [],
    status: 'planned',
    completedAt: '',
  },
];

interface ProjectState {
  projects: Project[];
  addProject: (p: Omit<Project, 'id'>) => void;
  updateProject: (id: string, p: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getById: (id: string) => Project | undefined;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: loadLS('projects', defaults),

  addProject: (p) => {
    const project = { ...p, id: generateId() };
    const projects = [...get().projects, project];
    set({ projects });
    saveLS('projects', projects);
  },

  updateProject: (id, updates) => {
    const projects = get().projects.map((p) => p.id === id ? { ...p, ...updates } : p);
    set({ projects });
    saveLS('projects', projects);
  },

  deleteProject: (id) => {
    const projects = get().projects.filter((p) => p.id !== id);
    set({ projects });
    saveLS('projects', projects);
  },

  getById: (id) => get().projects.find((p) => p.id === id),
}));
