import { create } from 'zustand';
import { loadLS, saveLS, generateId } from '../utils/storage';

export interface VocabRecord {
  date: string;
  count: number;
}

export interface Paper {
  id: string;
  title: string;
  authors: string;
  url: string;
  status: 'unread' | 'reading' | 'read' | 'reproduced';
  notes: string;
}

export interface SpeakingCard {
  id: string;
  question: string;
  recordingUrl?: string;
  selfRating: number;
  notes: string;
}

export interface ExamScore {
  id: string;
  date: string;
  type: string;
  score: number;
  totalScore: number;
}

const defaultPapers: Paper[] = [
  { id: 'pp-1', title: 'Attention Is All You Need', authors: 'Vaswani et al.', url: 'https://arxiv.org/abs/1706.03762', status: 'unread', notes: '' },
  { id: 'pp-2', title: 'LoRA: Low-Rank Adaptation of Large Language Models', authors: 'Hu et al.', url: 'https://arxiv.org/abs/2106.09685', status: 'unread', notes: '' },
  { id: 'pp-3', title: 'BERT: Pre-training of Deep Bidirectional Transformers', authors: 'Devlin et al.', url: 'https://arxiv.org/abs/1810.04805', status: 'unread', notes: '' },
  { id: 'pp-4', title: 'Training language models to follow instructions (InstructGPT)', authors: 'Ouyang et al.', url: 'https://arxiv.org/abs/2203.02155', status: 'unread', notes: '' },
  { id: 'pp-5', title: 'RAG: Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks', authors: 'Lewis et al.', url: 'https://arxiv.org/abs/2005.11401', status: 'unread', notes: '' },
  { id: 'pp-6', title: 'QLoRA: Efficient Finetuning of Quantized LLMs', authors: 'Dettmers et al.', url: 'https://arxiv.org/abs/2305.14314', status: 'unread', notes: '' },
  { id: 'pp-7', title: 'ReAct: Synergizing Reasoning and Acting in Language Models', authors: 'Yao et al.', url: 'https://arxiv.org/abs/2210.03629', status: 'unread', notes: '' },
];

const defaultSpeakingCards: SpeakingCard[] = [
  { id: 'sp-1', question: 'Introduce yourself in 1 minute.', recordingUrl: '', selfRating: 0, notes: '' },
  { id: 'sp-2', question: 'Explain Transformer architecture in simple terms.', recordingUrl: '', selfRating: 0, notes: '' },
  { id: 'sp-3', question: 'Why did you switch from Finance to Computer Science?', recordingUrl: '', selfRating: 0, notes: '' },
  { id: 'sp-4', question: 'What is your biggest technical challenge you have overcome?', recordingUrl: '', selfRating: 0, notes: '' },
  { id: 'sp-5', question: 'Describe a project you are most proud of.', recordingUrl: '', selfRating: 0, notes: '' },
  { id: 'sp-6', question: 'Where do you see yourself in 5 years?', recordingUrl: '', selfRating: 0, notes: '' },
];

interface EnglishState {
  vocabulary: VocabRecord[];
  papers: Paper[];
  speakingCards: SpeakingCard[];
  examScores: ExamScore[];

  addVocabRecord: (r: VocabRecord) => void;
  updatePaper: (id: string, u: Partial<Paper>) => void;
  addPaper: (p: Omit<Paper, 'id'>) => void;
  updateSpeaking: (id: string, u: Partial<SpeakingCard>) => void;
  addExamScore: (s: Omit<ExamScore, 'id'>) => void;
  getVocabGrowth: () => number;
}

export const useEnglishStore = create<EnglishState>((set, get) => ({
  vocabulary: loadLS('vocabulary', [] as VocabRecord[]),
  papers: loadLS('englishPapers', defaultPapers),
  speakingCards: loadLS('speakingCards', defaultSpeakingCards),
  examScores: loadLS('examScores', [] as ExamScore[]),

  addVocabRecord: (r) => {
    const vocab = [...get().vocabulary, r];
    set({ vocabulary: vocab });
    saveLS('vocabulary', vocab);
  },

  updatePaper: (id, u) => {
    const papers = get().papers.map((p) => p.id === id ? { ...p, ...u } : p);
    set({ papers });
    saveLS('englishPapers', papers);
  },

  addPaper: (p) => {
    const papers = [...get().papers, { ...p, id: generateId() }];
    set({ papers });
    saveLS('englishPapers', papers);
  },

  updateSpeaking: (id, u) => {
    const cards = get().speakingCards.map((c) => c.id === id ? { ...c, ...u } : c);
    set({ speakingCards: cards });
    saveLS('speakingCards', cards);
  },

  addExamScore: (s) => {
    const scores = [...get().examScores, { ...s, id: generateId() }];
    set({ examScores: scores });
    saveLS('examScores', scores);
  },

  getVocabGrowth: () => {
    const vocab = get().vocabulary;
    if (vocab.length < 2) return 0;
    const first = vocab[0].count;
    const last = vocab[vocab.length - 1].count;
    return last - first;
  },
}));
