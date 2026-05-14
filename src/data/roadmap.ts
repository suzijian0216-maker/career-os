import type { RoadmapPhase, SkillNode } from '../types';

export const initialRoadmap: RoadmapPhase[] = [
  {
    id: 'phase-1',
    name: '阶段一 · 编程基础',
    period: '2026.6-8',
    status: 'active',
    tasks: [
      { id: 't-1-1', content: 'Python 入门：变量/条件/循环/函数', done: false, month: '6月', resources: ['黑马程序员 B 站', '《Python 编程从入门到实践》'] },
      { id: 't-1-2', content: '列表/字典/文件读写 → 调 API/写完整脚本', done: false, month: '6月', resources: [] },
      { id: 't-1-3', content: 'LeetCode 简单题 10 道，独立做出 5 道', done: false, month: '6月', resources: ['LeetCode 热题 100'] },
      { id: 't-1-4', content: 'numpy + pandas 基础', done: false, month: '7月', resources: ['《利用 Python 进行数据分析》'] },
      { id: 't-1-5', content: 'Linux 基础命令 + Git/GitHub', done: false, month: '7月', resources: ['《鸟哥的 Linux 私房菜》前 5 章'] },
      { id: 't-1-6', content: '数据结构：数组/链表/哈希表/栈队列/递归/二叉树', done: false, month: '8月', resources: ['《代码随想录》'] },
      { id: 't-1-7', content: 'LeetCode 简单 50 + 中等 10', done: false, month: '8月', resources: ['LeetCode 按标签刷'] },
    ],
  },
  {
    id: 'phase-2',
    name: '阶段二 · CS 基础 + ML 入门',
    period: '2026.9-12',
    status: 'future',
    tasks: [
      { id: 't-2-1', content: '树与图 (DFS/BFS/BST)', done: false, month: '9月', resources: ['《代码随想录》'] },
      { id: 't-2-2', content: '排序算法 + 动态规划入门', done: false, month: '10月', resources: [] },
      { id: 't-2-3', content: '计算机网络（TCP/UDP/HTTP/DNS）', done: false, month: '10月', resources: ['《计算机网络：自顶向下》', '小林 coding'] },
      { id: 't-2-4', content: '操作系统（进程/线程/死锁/虚拟内存）', done: false, month: '11月', resources: ['小林 coding OS 篇'] },
      { id: 't-2-5', content: 'MySQL（索引/事务/锁）', done: false, month: '11月', resources: ['《MySQL 必知必会》', '小林 coding MySQL 篇'] },
      { id: 't-2-6', content: '机器学习入门（LR/决策树/K-means）', done: false, month: '12月', resources: ['吴恩达 Coursera ML', 'sklearn'] },
    ],
  },
  {
    id: 'phase-3',
    name: '阶段三 · DL + LLM 专项',
    period: '2027.1-6',
    status: 'future',
    tasks: [
      { id: 't-3-1', content: 'PyTorch 基础 → MLP → CNN/RNN', done: false, month: '1月', resources: ['李沐《动手学深度学习》'] },
      { id: 't-3-2', content: 'Transformer 精读 + 手写 Self-Attention', done: false, month: '1月', resources: ['d2l.ai', 'The Illustrated Transformer'] },
      { id: 't-3-3', content: 'Stanford CS224N NLP 基础', done: false, month: '2-3月', resources: ['CS224N 2023'] },
      { id: 't-3-4', content: 'HuggingFace 生态（transformers/datasets/peft）', done: false, month: '4月', resources: ['HF 官方文档'] },
      { id: 't-3-5', content: '跑通 Qwen LoRA 微调', done: false, month: '4月', resources: [] },
      { id: 't-3-6', content: 'RAG (LangChain + ChromaDB) + Agent (function calling)', done: false, month: '5月', resources: ['LangChain 文档'] },
      { id: 't-3-7', content: '标志性项目：金融研报智能问答系统', done: false, month: '5月', resources: [] },
      { id: 't-3-8', content: '简历 + 海投第一段日常实习', done: false, month: '6月', resources: [] },
    ],
  },
  {
    id: 'phase-4',
    name: '阶段四 · 实习 + 行测英语',
    period: '2027.7 — 2028.6',
    status: 'future',
    tasks: [
      { id: 't-4-1', content: '第一段实习（AI/ML/数据方向）', done: false, month: '2027夏', resources: [] },
      { id: 't-4-2', content: '持续刷行测（粉笔/华图）', done: false, month: '2027秋', resources: [] },
      { id: 't-4-3', content: '英语 CET-6 阅读训练', done: false, month: '2027秋', resources: [] },
      { id: 't-4-4', content: '金融央企暑期实习投递', done: false, month: '2028春', resources: [] },
      { id: 't-4-5', content: '暑期实习 → 争取转正', done: false, month: '2028夏', resources: [] },
    ],
  },
  {
    id: 'phase-5',
    name: '阶段五 · 秋招双线 + 毕业',
    period: '2028.9 — 2029.6',
    status: 'future',
    tasks: [
      { id: 't-5-1', content: '秋招线 A：四大行总行科技岗 / 金融基础设施', done: false, month: '2028.9-10', resources: [] },
      { id: 't-5-2', content: '秋招线 B：互联网 LLM 算法岗 / 武汉后台中心', done: false, month: '2028.9-10', resources: [] },
      { id: 't-5-3', content: '国考笔试', done: false, month: '2028.11', resources: [] },
      { id: 't-5-4', content: '面试季 + offer 选择', done: false, month: '2028.12-2029.2', resources: [] },
      { id: 't-5-5', content: '毕业论文', done: false, month: '2029.3-6', resources: [] },
    ],
  },
];

export const initialSkills: SkillNode[] = [
  { id: 'sk-py', name: 'Python', category: '编程语言', level: 0, stage: 'outsider', lastUpdated: '', subSkills: [{ name: '基本语法', done: false }, { name: '函数/类', done: false }, { name: '文件IO', done: false }, { name: 'API调用', done: false }] },
  { id: 'sk-ds', name: '数据结构', category: 'CS基础', level: 0, stage: 'outsider', lastUpdated: '', subSkills: [{ name: '数组/链表', done: false }, { name: '哈希表', done: false }, { name: '树/图', done: false }, { name: '排序算法', done: false }, { name: '动态规划', done: false }] },
  { id: 'sk-net', name: '计算机网络', category: 'CS基础', level: 0, stage: 'outsider', lastUpdated: '', subSkills: [{ name: 'TCP/UDP', done: false }, { name: 'HTTP/DNS', done: false }, { name: 'TLS', done: false }] },
  { id: 'sk-os', name: '操作系统', category: 'CS基础', level: 0, stage: 'outsider', lastUpdated: '', subSkills: [{ name: '进程/线程', done: false }, { name: '内存管理', done: false }, { name: '文件系统', done: false }] },
  { id: 'sk-sql', name: 'MySQL', category: 'CS基础', level: 0, stage: 'outsider', lastUpdated: '', subSkills: [{ name: '索引优化', done: false }, { name: '事务/锁', done: false }, { name: 'SQL编写', done: false }] },
  { id: 'sk-ml', name: '机器学习', category: 'ML/DL', level: 0, stage: 'outsider', lastUpdated: '', subSkills: [{ name: '线性回归/逻辑回归', done: false }, { name: '决策树/SVM', done: false }, { name: '集成学习', done: false }, { name: '过拟合处理', done: false }] },
  { id: 'sk-dl', name: '深度学习', category: 'ML/DL', level: 0, stage: 'outsider', lastUpdated: '', subSkills: [{ name: 'PyTorch', done: false }, { name: 'CNN/RNN', done: false }, { name: 'Transformer', done: false }, { name: '优化器/正则化', done: false }] },
  { id: 'sk-llm', name: 'LLM 应用', category: 'LLM', level: 0, stage: 'outsider', lastUpdated: '', subSkills: [{ name: 'Prompt Engineering', done: false }, { name: 'LoRA 微调', done: false }, { name: 'RAG', done: false }, { name: 'Agent', done: false }, { name: '模型部署', done: false }] },
  { id: 'sk-fin', name: '金融知识', category: '金融', level: 35, stage: 'beginner', lastUpdated: '', subSkills: [{ name: '金融产品', done: true }, { name: '风险管理', done: false }, { name: '金融科技', done: false }] },
  { id: 'sk-int', name: '面试/行测', category: '求职', level: 5, stage: 'outsider', lastUpdated: '', subSkills: [{ name: '自我介绍', done: false }, { name: '技术面试', done: false }, { name: '行测', done: false }, { name: '英语口语', done: false }] },
];
