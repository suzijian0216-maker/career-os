import type { FlashCard } from '../types';

export const initialFlashcards: FlashCard[] = [
  // --- 数据结构 ---
  { id: 'fc-001', category: '技术基础/数据结构', question: '数组和链表的区别是什么？各自适用场景？', answer: '数组连续内存，O(1)随机访问，插入删除O(n)；链表非连续，O(n)访问，插入删除O(1)。数组适合读多写少，链表适合频繁增删。', hints: ['内存布局', '时间复杂度对比'], followUps: ['哈希表是如何实现的？', '跳表了解吗？和平衡树的区别？'], difficulty: 'easy', mastery: 0, lastReviewed: '', reviewCount: 0, source: '八股文' },
  { id: 'fc-002', category: '技术基础/数据结构', question: '什么是哈希冲突？如何解决？', answer: '不同key映射到同一个槽。解决方法：1)开放地址法（线性探测、二次探测），2)链地址法（拉链），3)再哈希法，4)公共溢出区。Java HashMap用拉链+红黑树。', hints: ['HashMap实现'], followUps: ['一致性哈希是什么？用在什么地方？'], difficulty: 'medium', mastery: 0, lastReviewed: '', reviewCount: 0, source: '八股文' },
  { id: 'fc-003', category: '技术基础/数据结构', question: '二叉树的遍历方式有哪些？', answer: 'DFS：前序(根左右)、中序(左根右)、后序(左右根)；BFS：层序遍历。递归和迭代两种写法都要会。', hints: ['递归/迭代', 'Morris遍历了解'], followUps: ['BST的增删改查复杂度？', '平衡二叉树有哪些？'], difficulty: 'easy', mastery: 0, lastReviewed: '', reviewCount: 0, source: '八股文' },

  // --- 计网 ---
  { id: 'fc-010', category: '技术基础/计算机网络', question: 'TCP 三次握手和四次挥手的过程？', answer: '三次握手：SYN → SYN-ACK → ACK。为什么不是两次？防止历史连接。四次挥手：FIN → ACK → FIN → ACK。TIME_WAIT=2MSL，确保最后一个ACK到达。', hints: ['状态转换图', '2MSL'], followUps: ['TIME_WAIT 为什么是 2MSL？', '如果同时关闭呢？'], difficulty: 'medium', mastery: 0, lastReviewed: '', reviewCount: 0, source: '八股文' },
  { id: 'fc-011', category: '技术基础/计算机网络', question: 'HTTP 和 HTTPS 的区别？HTTPS 握手过程？', answer: 'HTTPS = HTTP + TLS。TLS 1.3握手：ClientHello(支持的密码套件+key_share) → ServerHello(选定套件+证书+key_share) → 双方计算会话密钥 → Finished。1-RTT。', hints: ['TLS 1.3 vs 1.2', '证书链'], followUps: ['中间人攻击如何防范？', 'HTTP/2 和 HTTP/3 的区别？'], difficulty: 'medium', mastery: 0, lastReviewed: '', reviewCount: 0, source: '八股文' },

  // --- OS ---
  { id: 'fc-020', category: '技术基础/操作系统', question: '进程和线程的区别？', answer: '进程是资源分配最小单位，线程是CPU调度最小单位。进程有独立地址空间，线程共享堆但各有栈。切换开销：进程>线程。协程更轻，用户态调度。', hints: ['地址空间', '上下文切换开销'], followUps: ['fork() 后父子进程共享什么？', '线程池如何设计？'], difficulty: 'easy', mastery: 0, lastReviewed: '', reviewCount: 0, source: '八股文' },
  { id: 'fc-021', category: '技术基础/操作系统', question: '什么是死锁？四个必要条件？', answer: '死锁：多个进程互相等待对方的资源，无法继续执行。四条件：互斥、占有且等待、不可抢占、循环等待。破坏任一即可预防。银行家算法避免死锁。', hints: ['哲学家就餐'], followUps: ['实际项目中遇到过死锁吗？', '死锁检测和恢复怎么做？'], difficulty: 'medium', mastery: 0, lastReviewed: '', reviewCount: 0, source: '八股文' },

  // --- MySQL ---
  { id: 'fc-030', category: '技术基础/MySQL', question: 'MySQL 索引底层数据结构？为什么用 B+ 树？', answer: 'B+树：非叶节点只存key，叶节点存数据且形成有序链表。优点：1)高度低IO少，2)范围查询高效（链表遍历），3)查询稳定（都在叶节点）。InnoDB聚簇索引：主键索引叶存行数据，二级索引叶存主键值。', hints: ['B+ vs B树 vs 哈希'], followUps: ['联合索引的最左前缀原则？', '覆盖索引是什么？'], difficulty: 'medium', mastery: 0, lastReviewed: '', reviewCount: 0, source: '八股文' },
  { id: 'fc-031', category: '技术基础/MySQL', question: '事务的 ACID 特性和隔离级别？', answer: 'ACID：原子性(undo log)、一致性、隔离性(锁+MVCC)、持久性(redo log)。四个隔离级别：读未提交、读已提交(RC)、可重复读(RR)、串行化。InnoDB默认RR，MVCC解决幻读。', hints: ['MVCC原理', 'undo/redo log'], followUps: ['MySQL 如何解决幻读？', '分布式事务了解吗？'], difficulty: 'medium', mastery: 0, lastReviewed: '', reviewCount: 0, source: '八股文' },

  // --- ML ---
  { id: 'fc-040', category: 'ML·DL/机器学习', question: '过拟合和欠拟合怎么判断？如何解决？', answer: '过拟合：训练集效果好、验证集差 → 加数据、正则化(L1/L2)、Dropout、Early Stopping、减少参数。欠拟合：两者都差 → 加特征、加复杂度、减正则化。看 learning curve。', hints: ['偏差-方差权衡'], followUps: ['L1和L2的区别？', 'Dropout为什么有效？'], difficulty: 'easy', mastery: 0, lastReviewed: '', reviewCount: 0, source: '吴恩达ML' },

  // --- LLM ---
  { id: 'fc-050', category: 'LLM/基础', question: 'Transformer 的 Self-Attention 机制讲一下', answer: 'Q=Wq·X, K=Wk·X, V=Wv·X → Attention=softmax(QK^T/√dk)·V。除以√dk防止点积过大导致softmax梯度消失。多头：多组Wq/Wk/Wv并行，捕捉不同子空间信息。', hints: ['QKV含义', '√dk的作用'], followUps: ['MHA和MQA/GQA的区别？', '为什么Transformer用LN而不是BN？'], difficulty: 'medium', mastery: 0, lastReviewed: '', reviewCount: 0, source: 'Attention Is All You Need' },
  { id: 'fc-051', category: 'LLM/微调', question: 'LoRA 的原理是什么？为什么低秩近似有效？', answer: 'LoRA在原权重旁加低秩矩阵BA，只训练A和B。ΔW=BA，r<<d。推理时合并到原权重：W\'=W+BA，无额外推理开销。低秩假设：微调时权重的更新位于低秩子空间。', hints: ['低秩假设', '合并推理'], followUps: ['QLoRA 比 LoRA 多了什么？', 'r值怎么选？'], difficulty: 'medium', mastery: 0, lastReviewed: '', reviewCount: 0, source: 'LoRA论文' },
  { id: 'fc-052', category: 'LLM/RAG', question: 'RAG 的完整流程是什么？如何评估 RAG 质量？', answer: '离线：文档切割→Embedding→存入向量库。在线：Query→Embedding→检索Top-K→拼入Prompt→LLM生成。评估：检索质量(Recall/NDCG)、生成质量(Faithfulness/Relevance)、端到端(ROUGE/BLEU)。', hints: ['分块策略', '检索+生成评估'], followUps: ['RAG 中常见的坑有哪些？', '如何做多轮对话RAG？'], difficulty: 'hard', mastery: 0, lastReviewed: '', reviewCount: 0, source: 'LangChain文档' },
  { id: 'fc-053', category: 'LLM/Agent', question: 'ReAct 模式是什么？和 Function Calling 什么关系？', answer: 'ReAct = Reasoning + Acting：思维链推理→行动→观察→推理→...，交替进行。Function Calling 是实现 ReAct 的一种方式：LLM 输出 function call → 执行 → 结果回传 → LLM 继续推理。', hints: ['ReAct论文', 'Tool Use'], followUps: ['Agent 的记忆模块怎么设计？', '多 Agent 协作怎么做？'], difficulty: 'hard', mastery: 0, lastReviewed: '', reviewCount: 0, source: 'ReAct论文' },

  // --- 金融 ---
  { id: 'fc-060', category: '金融知识/金融科技', question: '介绍一下金融科技（FinTech）的主要应用方向', answer: '支付清算(支付宝/银联)、借贷(微众/网商)、财富管理(智能投顾)、保险科技、监管科技(RegTech)、区块链/数字货币(数字人民币)。传统金融机构的数字化转型是最大机会。', hints: ['结合你的背景'], followUps: ['LLM 在金融领域有哪些应用场景？', '金融科技的风险和监管趋势？'], difficulty: 'medium', mastery: 0, lastReviewed: '', reviewCount: 0, source: '自建' },

  // --- 行为面试 ---
  { id: 'fc-070', category: '行为面试/自我介绍', question: '请做一个 1 分钟的自我介绍', answer: '我是XX，本科华科金融工程，保研北大软微金融科技。虽然计算机零基础起步，但我用三年时间系统学习从Python到LLM的全栈能力，做了金融研报智能问答系统。我的差异化优势是金融领域知识+AI工程能力的复合背景，特别适合金融科技岗。', hints: ['控制在60秒', '突出差异化'], followUps: ['你最大的缺点是什么？', '为什么不做量化？'], difficulty: 'easy', mastery: 0, lastReviewed: '', reviewCount: 0, source: '自建' },
  { id: 'fc-071', category: '行为面试/职业规划', question: '你的 3-5 年职业规划是什么？', answer: '短期(1-2年)：扎实掌握LLM应用开发全链路，积累金融科技项目/实习。中期(3-5年)：成为金融AI领域能独当一面的工程师，在金融央企或头部金融科技公司，把AI真正落地到金融场景。长期：技术+业务双修，成为既懂金融又懂AI的复合型人才。', hints: ['具体+可执行', '呼应岗位'], followUps: ['你对加班的看法？', '选择工作时你最看重什么？'], difficulty: 'medium', mastery: 0, lastReviewed: '', reviewCount: 0, source: '自建' },

  // --- 行测 ---
  { id: 'fc-080', category: '行测/数量关系', question: '一项工程，甲单独做 15 天完成，乙单独做 10 天完成。两人合作 3 天后，甲离开，乙还需要几天完成？', answer: '甲效率1/15，乙1/10。合作3天：(1/15+1/10)×3 = 1/2。剩余1/2 ÷ 1/10 = 5天。', hints: ['设总量为30份（15和10的最小公倍数）'], followUps: [], difficulty: 'easy', mastery: 0, lastReviewed: '', reviewCount: 0, source: '行测题库' },
];
