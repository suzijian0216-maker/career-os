import { create } from 'zustand';
import { loadLS, saveLS } from '../utils/storage';

export interface TurningPoint {
  id: string;
  date: string;
  title: string;
  narrative: string;
  tags: string[];
}

export interface SkillCard {
  id: string;
  skill: string;
  proof: string;
  projectId: string;
}

export type ViewMode = 'hr' | 'interviewer' | 'alumni';

interface ProfileState {
  name: string;
  title: string;
  tagline: string;
  turningPoints: TurningPoint[];
  skillCards: SkillCard[];
  personalityTags: { tag: string; explanation: string; endorsements: number }[];
  viewMode: ViewMode;

  setViewMode: (m: ViewMode) => void;
  addTurningPoint: (tp: Omit<TurningPoint, 'id'>) => void;
  updateTurningPoint: (id: string, tp: Partial<TurningPoint>) => void;
  addSkillCard: (sc: Omit<SkillCard, 'id'>) => void;
  endorseTag: (tag: string) => void;
  getViewModeLabel: () => string;
}

const defaultTurningPoints: TurningPoint[] = [
  { id: 'tp-1', date: '2022-09', title: '华中科技大学入学', narrative: '考入华中科技大学金融工程专业。在华科的四年，打下了扎实的金融和数理基础，也让我意识到——金融的未来在于技术。', tags: ['教育', '金融'] },
  { id: 'tp-2', date: '2025-03', title: '决定转码', narrative: '经过一学期的思考，决定从金融向计算机跨越。不是放弃金融，而是把金融作为应用场景，用技术去解决金融的问题。目标：大模型应用开发。', tags: ['转折', '决策'] },
  { id: 'tp-3', date: '2025-07', title: '保研北大软微', narrative: '收到北京大学软件与微电子学院金融科技方向的拟录取通知。这是转码之路的关键一步——名校 CS 硕士给了我从零开始的底气。', tags: ['教育', '转折'] },
  { id: 'tp-4', date: '2026-06', title: 'Python 零基础启程', narrative: '从最基本的变量、循环开始学 Python。每天 3-4 小时，一周后能写简单脚本了。零基础不可怕，持续学习才是关键。', tags: ['技术', '起点'] },
];

const defaultSkillCards: SkillCard[] = [
  { id: 'sc-1', skill: 'Python', proof: '从零开始系统学习 Python，6 个月内完成 LeetCode 100+ 题', projectId: '' },
  { id: 'sc-2', skill: '金融分析', proof: '本科金融工程专业，系统学习金融产品、风险管理、衍生品定价', projectId: '' },
  { id: 'sc-3', skill: '数据建模', proof: '用 pandas/numpy 处理金融数据，完成过股票因子分析项目', projectId: '' },
  { id: 'sc-4', skill: 'LLM 应用', proof: '基于 RAG 搭建金融研报智能问答系统，跑通 LoRA 微调全流程', projectId: 'fin-rag' },
];

const defaultTags = [
  { tag: 'WLB 优先', explanation: '工作生活平衡对我来说比薪资更重要。每天 5:30 下班才能有精力持续学习和陪伴家人。', endorsements: 0 },
  { tag: '持续学习者', explanation: '从金融跨到计算机，靠的就是持续学习能力。我相信学习能力比当前技能更重要。', endorsements: 0 },
  { tag: '金融+科技双栖', explanation: '金融学背景 + AI 工程能力，在金融科技领域具有差异化竞争力。', endorsements: 0 },
  { tag: '江西人', explanation: '出生在江西，对江西有感情。但也在探索北京和武汉的可能性。', endorsements: 0 },
  { tag: '务实派', explanation: '不做科研、不写论文，专注工程落地。技术要能解决实际问题。', endorsements: 0 },
];

export const useProfileStore = create<ProfileState>((set, get) => ({
  name: loadLS('profileName', ''),
  title: loadLS('profileTitle', '华科金工 → 北大软微 | LLM 应用开发'),
  tagline: loadLS('profileTagline', '从金融跨界大模型应用开发的北大硕士，擅长把金融领域知识转化为 AI 产品'),
  turningPoints: loadLS('turningPoints', defaultTurningPoints),
  skillCards: loadLS('skillCards', defaultSkillCards),
  personalityTags: loadLS('personalityTags', defaultTags),
  viewMode: 'hr',

  setViewMode: (m) => set({ viewMode: m }),
  addTurningPoint: (tp) => {
    const tps = [...get().turningPoints, { ...tp, id: 'tp-' + Date.now() }];
    set({ turningPoints: tps });
    saveLS('turningPoints', tps);
  },
  updateTurningPoint: (id, tp) => {
    const tps = get().turningPoints.map((t) => t.id === id ? { ...t, ...tp } : t);
    set({ turningPoints: tps });
    saveLS('turningPoints', tps);
  },
  addSkillCard: (sc) => {
    const cards = [...get().skillCards, { ...sc, id: 'sc-' + Date.now() }];
    set({ skillCards: cards });
    saveLS('skillCards', cards);
  },
  endorseTag: (tag) => {
    const tags = get().personalityTags.map((t) => t.tag === tag ? { ...t, endorsements: t.endorsements + 1 } : t);
    set({ personalityTags: tags });
    saveLS('personalityTags', tags);
  },
  getViewModeLabel: () => {
    const m = get().viewMode;
    return m === 'hr' ? 'HR 视角：稳重专业' : m === 'interviewer' ? '面试官视角：技术导向' : '校友视角：亲切共鸣';
  },
}));
