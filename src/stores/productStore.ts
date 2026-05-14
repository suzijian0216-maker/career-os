import { create } from 'zustand';
import { loadLS, saveLS, generateId } from '../utils/storage';

export interface ProductIdea {
  id: string;
  title: string;
  description: string;
  feasibility: number;
  businessValue: number;
  status: 'draft' | 'researching' | 'building' | 'abandoned';
  createdAt: string;
}

export interface CompetitiveAnalysis {
  id: string;
  company: string;
  product: string;
  features: { name: string; releaseDate: string; myTake: string }[];
  pricing: string;
  strategy: string;
  lastUpdated: string;
}

export interface AICaseStudy {
  id: string;
  title: string;
  company: string;
  domain: string;
  techUsed: string[];
  businessModel: string;
  keyTakeaway: string;
  url: string;
}

const defaultIdeas: ProductIdea[] = [
  { id: 'pi-1', title: '基金招募书智能比对工具', description: '用 RAG 技术自动比对多份基金的招募说明书，标注差异和风险条款，帮助投资者快速决策。', feasibility: 4, businessValue: 4, status: 'draft', createdAt: '2026-05-01' },
  { id: 'pi-2', title: '银行客服知识库 Agent', description: '面向银行客服场景的 RAG + Agent 系统，自动回答客户关于开户、贷款、信用卡的常见问题，支持多轮对话。', feasibility: 5, businessValue: 5, status: 'draft', createdAt: '2026-05-10' },
];

const defaultCompetitors: CompetitiveAnalysis[] = [
  {
    id: 'ca-1', company: 'DeepSeek', product: 'DeepSeek V3 / R1',
    features: [
      { name: 'MoE 架构', releaseDate: '2024-12', myTake: '极致性价比路线，推理成本远低于 GPT-4，适合大规模部署' },
      { name: 'R1 推理模型', releaseDate: '2025-01', myTake: 'CoT+RL 的推理能力，在数学和代码方面表现突出' },
    ],
    pricing: 'API 按 token 计费，远低于 OpenAI', strategy: '开源 + 低成本 + 极致推理能力', lastUpdated: '2026-05-10',
  },
  {
    id: 'ca-2', company: '智谱 AI', product: 'GLM / ChatGLM',
    features: [
      { name: 'GLM-4 系列', releaseDate: '2024-06', myTake: '国内最早的大模型团队之一，学术底蕴深厚' },
      { name: 'AutoGLM', releaseDate: '2024-12', myTake: 'Agent 能力探索，Phone Use 方向的尝试' },
    ],
    pricing: 'API 按 token 计费，有免费额度', strategy: 'B端 + 学术 + 开源社区', lastUpdated: '2026-05-10',
  },
  {
    id: 'ca-3', company: '字节跳动', product: '豆包 / 火山方舟',
    features: [
      { name: '豆包大模型', releaseDate: '2024-05', myTake: '价格战打法，大幅降低大模型使用成本' },
      { name: '扣子 Coze', releaseDate: '2024-12', myTake: 'AI Bot 开发平台，降低了 AI 应用开发门槛' },
    ],
    pricing: '极低价策略，按 token 计费', strategy: '低价 + 生态 + C端应用', lastUpdated: '2026-05-10',
  },
];

const defaultCases: AICaseStudy[] = [
  { id: 'cs-1', title: '工行：大模型在反洗钱中的应用', company: '工商银行', domain: '金融', techUsed: ['LLM', '知识图谱', '规则引擎'], businessModel: '内部提效——减少人工审核量 60%', keyTakeaway: '金融央企的核心诉求是合规+提效，LLM 可以帮助处理非结构化数据', url: '' },
  { id: 'cs-2', title: '蚂蚁：大模型赋能智能理财顾问', company: '蚂蚁集团', domain: '金融', techUsed: ['RAG', '多模态', '个性化推荐'], businessModel: 'C端变现——提高理财产品的匹配转化率', keyTakeaway: 'AI 不只是效率工具，可以成为 C 端产品的核心竞争力', url: '' },
  { id: 'cs-3', title: 'BloombergGPT：金融专有大模型', company: 'Bloomberg', domain: '金融', techUsed: ['LLM', '金融语料', '领域训练'], businessModel: '产品化——Bloomberg Terminal 的 AI 升级', keyTakeaway: '金融领域的专有模型有巨大价值，但需要大量高质量金融语料', url: '' },
];

interface ProductState {
  ideas: ProductIdea[];
  competitors: CompetitiveAnalysis[];
  caseStudies: AICaseStudy[];

  addIdea: (i: Omit<ProductIdea, 'id' | 'createdAt'>) => void;
  updateIdea: (id: string, i: Partial<ProductIdea>) => void;
  deleteIdea: (id: string) => void;
  addFeature: (compId: string, f: CompetitiveAnalysis['features'][0]) => void;
  addCaseStudy: (cs: Omit<AICaseStudy, 'id'>) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  ideas: loadLS('productIdeas', defaultIdeas),
  competitors: loadLS('competitors', defaultCompetitors),
  caseStudies: loadLS('caseStudies', defaultCases),

  addIdea: (i) => {
    const ideas = [...get().ideas, { ...i, id: generateId(), createdAt: new Date().toISOString().slice(0, 10) }];
    set({ ideas });
    saveLS('productIdeas', ideas);
  },
  updateIdea: (id, i) => {
    const ideas = get().ideas.map((x) => x.id === id ? { ...x, ...i } : x);
    set({ ideas });
    saveLS('productIdeas', ideas);
  },
  deleteIdea: (id) => {
    const ideas = get().ideas.filter((x) => x.id !== id);
    set({ ideas });
    saveLS('productIdeas', ideas);
  },
  addFeature: (compId, f) => {
    const competitors = get().competitors.map((c) => c.id === compId ? { ...c, features: [...c.features, f], lastUpdated: new Date().toISOString().slice(0, 10) } : c);
    set({ competitors });
    saveLS('competitors', competitors);
  },
  addCaseStudy: (cs) => {
    const caseStudies = [...get().caseStudies, { ...cs, id: generateId() }];
    set({ caseStudies });
    saveLS('caseStudies', caseStudies);
  },
}));
