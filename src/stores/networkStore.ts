import { create } from 'zustand';
import { loadLS, saveLS, generateId } from '../utils/storage';

export interface Contact {
  id: string;
  name: string;
  affiliation: string;
  role: string;
  schools: string[];
  relationship: 'alumni' | 'colleague' | 'mentor' | 'friend' | 'referrer' | 'other';
  closeness: number;
  lastInteraction: string;
  interactionLog: { date: string; summary: string; keyPoints: string[]; nextTopics: string[] }[];
  referrals: { company: string; position: string; date: string; result: string }[];
  notes: string;
}

const defaults: Contact[] = [
  { id: 'c-1', name: '张学长', affiliation: '工行总行', role: '金融科技部工程师', schools: ['华科'], relationship: 'alumni', closeness: 3, lastInteraction: '2026-04-15', interactionLog: [{ date: '2026-04-15', summary: '咨询了工行总行的工作体验', keyPoints: ['WLB 很好', '技术栈偏 Java', '北京户口稳'], nextTopics: ['内部 AI 项目机会'] }], referrals: [], notes: '华科计算机 2020 届，可帮忙内推' },
  { id: 'c-2', name: '李学姐', affiliation: '中债登', role: '技术开发', schools: ['北大'], relationship: 'alumni', closeness: 2, lastInteraction: '2026-05-01', interactionLog: [{ date: '2026-05-01', summary: '聊了中债登的工作内容', keyPoints: ['工作稳定', '薪资 30w+', '公积金高'], nextTopics: [] }], referrals: [], notes: '北大软微 2022 届' },
  { id: 'c-3', name: '王教授', affiliation: '北大软微', role: '副教授', schools: ['北大'], relationship: 'mentor', closeness: 4, lastInteraction: '2026-05-10', interactionLog: [{ date: '2026-05-10', summary: '讨论研究方向', keyPoints: ['建议做金融+AI方向', '可以推荐实习'], nextTopics: ['暑期实习计划'] }], referrals: [], notes: '导师，金融科技方向' },
  { id: 'c-4', name: '赵同学', affiliation: '字节跳动', role: 'LLM 算法工程师', schools: ['华科', '北大'], relationship: 'friend', closeness: 4, lastInteraction: '2026-04-20', interactionLog: [{ date: '2026-04-20', summary: '请教了 LLM 学习路线', keyPoints: ['先学 Python', '再看 Transformer', '建议复现论文'], nextTopics: ['RAG 实践'] }], referrals: [], notes: '华科+北大前辈，字节豆包团队' },
  { id: 'c-5', name: '陈 HR', affiliation: '建行武汉', role: 'HR', schools: [], relationship: 'other', closeness: 1, lastInteraction: '2025-12-01', interactionLog: [], referrals: [], notes: '校园招聘认识的建行武汉 HR' },
];

interface NetworkState {
  contacts: Contact[];
  addContact: (c: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, c: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  addInteraction: (contactId: string, log: Contact['interactionLog'][0]) => void;
  getStaleContacts: (days: number) => Contact[];
  getForceGraphData: () => { nodes: { id: string; name: string; category: number }[]; links: { source: string; target: string; label: string }[] };
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
  contacts: loadLS('contacts', defaults),

  addContact: (c) => {
    const contacts = [...get().contacts, { ...c, id: generateId() }];
    set({ contacts });
    saveLS('contacts', contacts);
  },

  updateContact: (id, updates) => {
    const contacts = get().contacts.map((c) => c.id === id ? { ...c, ...updates } : c);
    set({ contacts });
    saveLS('contacts', contacts);
  },

  deleteContact: (id) => {
    const contacts = get().contacts.filter((c) => c.id !== id);
    set({ contacts });
    saveLS('contacts', contacts);
  },

  addInteraction: (contactId, log) => {
    const contacts = get().contacts.map((c) => {
      if (c.id !== contactId) return c;
      return { ...c, interactionLog: [...c.interactionLog, log], lastInteraction: log.date };
    });
    set({ contacts });
    saveLS('contacts', contacts);
  },

  getStaleContacts: (days) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return get().contacts.filter((c) => new Date(c.lastInteraction) < cutoff);
  },

  getForceGraphData: () => {
    const contacts = get().contacts;
    const categories = ['alumni', 'colleague', 'mentor', 'friend', 'referrer', 'other'];
    const nodes = [
      { id: 'me', name: '我', category: -1 },
      ...contacts.map((c) => ({ id: c.id, name: c.name, category: categories.indexOf(c.relationship) })),
    ];
    const links = contacts.map((c) => ({
      source: 'me',
      target: c.id,
      label: c.relationship,
    }));
    // 同校关系
    for (let i = 0; i < contacts.length; i++) {
      for (let j = i + 1; j < contacts.length; j++) {
        const shared = contacts[i].schools.filter((s) => contacts[j].schools.includes(s));
        if (shared.length > 0) {
          links.push({ source: contacts[i].id, target: contacts[j].id, label: shared[0] + '校友' });
        }
      }
    }
    return { nodes, links };
  },
}));
