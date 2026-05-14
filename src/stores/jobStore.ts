import { create } from 'zustand';
import { loadLS, saveLS } from '../utils/storage';
import type { TargetCompany } from '../types';

const defaultCompanies: TargetCompany[] = [
  { id: 'icbc', name: '工行总行', tier: 'T1', category: '金融央企', city: '北京', salaryRange: '25-35w', wlb: 5, status: 'watching', notes: '' },
  { id: 'abc', name: '农行总行', tier: 'T1', category: '金融央企', city: '北京', salaryRange: '25-35w', wlb: 5, status: 'watching', notes: '' },
  { id: 'boc', name: '中行总行', tier: 'T1', category: '金融央企', city: '北京', salaryRange: '25-35w', wlb: 5, status: 'watching', notes: '' },
  { id: 'ccb', name: '建行总行', tier: 'T1', category: '金融央企', city: '北京', salaryRange: '25-35w', wlb: 5, status: 'watching', notes: '' },
  { id: 'ccdc', name: '中债登', tier: 'T1', category: '金融基础设施', city: '北京', salaryRange: '25-35w', wlb: 5, status: 'watching', notes: '' },
  { id: 'shch', name: '上清所', tier: 'T1', category: '金融基础设施', city: '上海', salaryRange: '25-35w', wlb: 5, status: 'watching', notes: '' },
  { id: 'unionpay', name: '银联', tier: 'T1', category: '金融基础设施', city: '上海', salaryRange: '25-35w', wlb: 5, status: 'watching', notes: '' },
  { id: 'sse-tech', name: '上交所技术', tier: 'T1', category: '交易所', city: '上海', salaryRange: '25-35w', wlb: 5, status: 'watching', notes: '' },
  { id: 'szse-tech', name: '深交所技术', tier: 'T1', category: '交易所', city: '深圳', salaryRange: '25-35w', wlb: 5, status: 'watching', notes: '' },
  { id: 'ccb-wh', name: '建行武汉数据中心', tier: 'T2', category: '银行后台', city: '武汉', salaryRange: '18-28w', wlb: 5, status: 'watching', notes: '' },
  { id: 'abc-wh', name: '农行武汉研发', tier: 'T2', category: '银行后台', city: '武汉', salaryRange: '18-28w', wlb: 5, status: 'watching', notes: '' },
  { id: 'deepseek', name: 'DeepSeek', tier: 'T0', category: '互联网', city: '北京/杭州', salaryRange: '50-80w', wlb: 3, status: 'watching', notes: '' },
  { id: 'bytedance', name: '字节跳动 (豆包)', tier: 'T1', category: '互联网', city: '北京', salaryRange: '40-65w', wlb: 2, status: 'watching', notes: '' },
  { id: 'zhipu', name: '智谱 AI', tier: 'T1', category: '互联网', city: '北京', salaryRange: '40-65w', wlb: 2.5, status: 'watching', notes: '' },
  { id: 'moonshot', name: '月之暗面', tier: 'T1', category: '互联网', city: '北京', salaryRange: '40-65w', wlb: 2.5, status: 'watching', notes: '' },
  { id: 'alibaba', name: '阿里 (通义)', tier: 'T1.5', category: '互联网', city: '北京/杭州', salaryRange: '35-55w', wlb: 2.5, status: 'watching', notes: '' },
  { id: 'baidu', name: '百度 (文心)', tier: 'T1.5', category: '互联网', city: '北京', salaryRange: '35-55w', wlb: 3, status: 'watching', notes: '' },
  { id: 'xiaomi-wh', name: '小米武汉', tier: 'T2', category: '互联网', city: '武汉', salaryRange: '25-40w', wlb: 3.5, status: 'watching', notes: '' },
  { id: 'huawei-wh', name: '华为武汉', tier: 'T2', category: '互联网', city: '武汉', salaryRange: '25-40w', wlb: 2.5, status: 'watching', notes: '' },
  { id: 'jiangxi-official', name: '江西省厅选调', tier: 'T2', category: '体制内', city: '南昌', salaryRange: '12-18w', wlb: 5, status: 'watching', notes: '' },
  { id: 'csrc', name: '证监会', tier: 'T1', category: '体制内', city: '北京', salaryRange: '20-30w', wlb: 4.5, status: 'watching', notes: '' },
];

interface JobState {
  companies: TargetCompany[];
  updateStatus: (id: string, status: TargetCompany['status']) => void;
  updateNotes: (id: string, notes: string) => void;
  getByTier: (tier: string) => TargetCompany[];
  getByCategory: (cat: string) => TargetCompany[];
  getStats: () => { total: number; applied: number; interviewing: number; offer: number };
}

export const useJobStore = create<JobState>((set, get) => ({
  companies: loadLS('companies', defaultCompanies),

  updateStatus: (id, status) => {
    const companies = get().companies.map((c) => c.id === id ? { ...c, status } : c);
    set({ companies });
    saveLS('companies', companies);
  },

  updateNotes: (id, notes) => {
    const companies = get().companies.map((c) => c.id === id ? { ...c, notes } : c);
    set({ companies });
    saveLS('companies', companies);
  },

  getByTier: (tier) => get().companies.filter((c) => c.tier === tier),
  getByCategory: (cat) => get().companies.filter((c) => c.category === cat),

  getStats: () => {
    const cs = get().companies;
    return {
      total: cs.length,
      applied: cs.filter((c) => c.status !== 'watching').length,
      interviewing: cs.filter((c) => c.status === 'interviewing').length,
      offer: cs.filter((c) => c.status === 'offer').length,
    };
  },
}));
