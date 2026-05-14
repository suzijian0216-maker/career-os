import { create } from 'zustand';
import { loadLS, saveLS } from '../utils/storage';

export interface CareerPath {
  id: string;
  name: string;
  icon: string;
  city: string;
  salaryStart: number;
  salary30: number;
  salary35: number;
  wlb: number;
  hukou: boolean;
  houseYears: number;
  stability: number;
  parentDistance: string;
  futureDiary: string;
  regretFactors: { factor: string; probability: number }[];
  color: string;
}

export interface ScenarioPreset {
  id: string;
  name: string;
  description: string;
  weights: { wlb: number; salary: number; hukou: number; house: number; family: number; growth: number };
}

const defaultPaths: CareerPath[] = [
  {
    id: 'beijing-central', name: '北京金融央企', icon: '🏦', city: '北京',
    salaryStart: 30, salary30: 45, salary35: 55,
    wlb: 5, hukou: true, houseYears: 15, stability: 5,
    parentDistance: '高铁 4h',
    futureDiary: '2029年的一天：7:30起床，8:30到工位，上午看监管科技项目进度，12:00食堂午饭，下午2:00技术评审，5:30准时下班。晚上和同事在簋街吃饭，聊了聊最近的数字人民币项目。公积金每月顶格缴，虽然买房还远，但配售房摇号排名靠前。周末去北大听了场讲座，约了导师聊职业发展。',
    regretFactors: [{ factor: '薪资涨幅慢', probability: 30 }, { factor: '技术氛围不足', probability: 40 }, { factor: '北京生活压力', probability: 50 }],
    color: '#2563eb',
  },
  {
    id: 'internet-llm', name: '互联网 LLM', icon: '🌐', city: '北京/深圳',
    salaryStart: 45, salary30: 100, salary35: 150,
    wlb: 2.5, hukou: false, houseYears: 8, stability: 2,
    parentDistance: '高铁 4-6h',
    futureDiary: '2029年的一天：9:30到公司，先看昨晚模型训练日志，10:00站会同步进度。下午和产品经理 battle 需求，5:00开始写 RAG 评估脚本。晚饭在工位吃外卖，7:00团队 Paper Reading，9:30打车回家。今天调参效果不错，Leader 夸了。周末加班上线新版本的 Agent 框架。虽然累，但技术成长飞快，GitHub 多了 100 个 star。',
    regretFactors: [{ factor: '35岁危机', probability: 40 }, { factor: 'WLB 差', probability: 60 }, { factor: '北京买房难', probability: 55 }],
    color: '#0d9488',
  },
  {
    id: 'jiangxi-official', name: '江西省厅公务员', icon: '🏛️', city: '南昌',
    salaryStart: 15, salary30: 22, salary35: 28,
    wlb: 5, hukou: false, houseYears: 3, stability: 5,
    parentDistance: '开车 2h',
    futureDiary: '2029年的一天：8:00骑车去单位，路上经过熟悉的街道。9:00参加处务会，讨论省内金融科技监管政策。中午食堂 2 块钱吃饱。下午写调研报告，5:30下班。晚上和父母一起吃饭，周末陪他们去体检。南昌房价 1.2w/㎡，房贷毫无压力。偶尔想：如果当年去了北京会怎样？但看到父母的笑脸，觉得值了。',
    regretFactors: [{ factor: '技术全丢', probability: 50 }, { factor: '薪资低', probability: 35 }, { factor: '一眼望到头', probability: 45 }],
    color: '#f0b90b',
  },
  {
    id: 'wuhan-bank', name: '武汉银行后台', icon: '🏠', city: '武汉',
    salaryStart: 22, salary30: 35, salary35: 45,
    wlb: 5, hukou: false, houseYears: 5, stability: 5,
    parentDistance: '高铁 1.5h',
    futureDiary: '2029年的一天：8:15开车到建行数据中心，早上处理一批数据库巡检。午饭后在园区散步，碰到华科的学长聊了几句。下午开发一个内部运维自动化工具，技术含量不高但很有成就感。5:30下班，去光谷的健身房。周末约了华科老同学吃饭。武汉房价不到北京一半，28岁买的房，月供轻松。偶尔想挑战一下自己，但整体很知足。',
    regretFactors: [{ factor: '技术成长慢', probability: 45 }, { factor: '发展天花板', probability: 35 }, { factor: '城市天花板低', probability: 25 }],
    color: '#7c3aed',
  },
];

const defaultPresets: ScenarioPreset[] = [
  { id: 'young', name: '22岁单身', description: '年轻，追求成长和高薪，不太在意 WLB', weights: { wlb: 10, salary: 35, hukou: 10, house: 5, family: 5, growth: 35 } },
  { id: 'family', name: '30岁想成家', description: '开始关注稳定、户口和买房', weights: { wlb: 25, salary: 20, hukou: 20, house: 20, family: 10, growth: 5 } },
  { id: 'parents', name: '父母优先', description: '离父母近最重要，其次稳定', weights: { wlb: 20, salary: 10, hukou: 5, house: 10, family: 45, growth: 10 } },
  { id: 'balanced', name: '均衡发展', description: '各方面都不走极端', weights: { wlb: 20, salary: 20, hukou: 15, house: 15, family: 15, growth: 15 } },
];

interface CareerState {
  paths: CareerPath[];
  presets: ScenarioPreset[];
  weights: { wlb: number; salary: number; hukou: number; house: number; family: number; growth: number };
  activePreset: string;

  setWeights: (w: CareerState['weights']) => void;
  applyPreset: (id: string) => void;
  getMatchScores: () => { pathId: string; score: number }[];
  getTopPath: () => CareerPath | null;
}

export const useCareerStore = create<CareerState>((set, get) => ({
  paths: loadLS('careerPaths', defaultPaths),
  presets: defaultPresets,
  weights: loadLS('careerWeights', { wlb: 35, salary: 25, hukou: 15, house: 10, family: 10, growth: 5 }),
  activePreset: 'custom',

  setWeights: (w) => {
    set({ weights: w, activePreset: 'custom' });
    saveLS('careerWeights', w);
  },

  applyPreset: (id) => {
    const preset = get().presets.find((p) => p.id === id);
    if (!preset) return;
    set({ weights: { ...preset.weights }, activePreset: id });
    saveLS('careerWeights', { ...preset.weights });
  },

  getMatchScores: () => {
    const { paths, weights } = get();
    const wSum = Object.values(weights).reduce((s, v) => s + v, 0) || 1;
    return paths.map((p) => {
      const score = Math.round(
        (weights.wlb * p.wlb * 20 +
          weights.salary * (p.salaryStart / 45 * 100) +
          weights.hukou * (p.hukou ? 100 : 0) +
          weights.house * (100 - p.houseYears * 6) +
          weights.family * (100 - parseInt(p.parentDistance) * 5 || 50) +
          weights.growth * (p.stability === 5 ? 40 : 90)
        ) / wSum
      );
      return { pathId: p.id, score: Math.min(100, Math.max(0, score)) };
    });
  },

  getTopPath: () => {
    const scores = get().getMatchScores();
    const top = scores.sort((a, b) => b.score - a.score)[0];
    return get().paths.find((p) => p.id === top.pathId) || null;
  },
}));
