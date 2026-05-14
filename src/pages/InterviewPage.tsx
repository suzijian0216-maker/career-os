import { useState, useMemo } from 'react';
import { useInterviewStore } from '../stores/interviewStore';
import FlashCardView from '../components/shared/FlashCard';
import type { FlashCard } from '../types';
import styles from './InterviewPage.module.css';

export default function InterviewPage() {
  const {
    cards, sessions, currentCardIndex, isFlipped, filterCategory,
    setFilterCategory, flipCard, nextCard, prevCard, rateCard,
    addCard, deleteCard, updateCard,
    getFilteredCards, getCategories,
  } = useInterviewStore();

  const filteredCards = getFilteredCards();
  const categories = getCategories();
  const currentCard = filteredCards[currentCardIndex] || null;

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState<Partial<FlashCard>>({
    category: '', question: '', answer: '', difficulty: 'medium', hints: [], followUps: [], source: '自建',
  });
  const [hintInput, setHintInput] = useState('');
  const [followUpInput, setFollowUpInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // 按分类统计
  const categoryStats = useMemo(() => {
    const map: Record<string, { total: number; mastered: number }> = {};
    cards.forEach((c) => {
      const cat = c.category.split('/')[0];
      if (!map[cat]) map[cat] = { total: 0, mastered: 0 };
      map[cat].total++;
      if (c.mastery >= 70) map[cat].mastered++;
    });
    return map;
  }, [cards]);

  const filteredBySearch = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return cards.filter((c) =>
      c.question.toLowerCase().includes(q) ||
      c.answer.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  }, [cards, searchQuery]);

  const handleAddCard = () => {
    if (!newCard.question || !newCard.answer || !newCard.category) return;
    addCard({
      id: 'fc-custom-' + Date.now(),
      category: newCard.category || '',
      question: newCard.question || '',
      answer: newCard.answer || '',
      hints: newCard.hints || [],
      followUps: newCard.followUps || [],
      difficulty: newCard.difficulty || 'medium',
      mastery: 0,
      lastReviewed: '',
      reviewCount: 0,
      source: '自建',
    });
    setNewCard({ category: '', question: '', answer: '', difficulty: 'medium', hints: [], followUps: [], source: '自建' });
    setHintInput('');
    setFollowUpInput('');
    setShowAddForm(false);
  };

  return (
    <div className={styles.page}>
      {/* 题库统计 */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{cards.length}</div>
          <div className={styles.statLabel}>总题目</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{cards.filter((c) => c.mastery >= 70).length}</div>
          <div className={styles.statLabel}>已掌握</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{sessions.length}</div>
          <div className={styles.statLabel}>Mock 次数</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{categories.length}</div>
          <div className={styles.statLabel}>分类数</div>
        </div>
      </div>

      <div className={styles.grid}>
        {/* 左侧：分类 + 搜索 */}
        <div className={styles.sidebar}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📂 分类筛选</h3>
            <button
              className={`${styles.catBtn} ${!filterCategory ? styles.catActive : ''}`}
              onClick={() => setFilterCategory('')}
            >
              全部 ({cards.length})
            </button>
            {Object.entries(categoryStats).map(([cat, stats]) => (
              <button
                key={cat}
                className={`${styles.catBtn} ${filterCategory === cat ? styles.catActive : ''}`}
                onClick={() => setFilterCategory(filterCategory === cat ? '' : cat)}
              >
                {cat} ({stats.mastered}/{stats.total})
              </button>
            ))}
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>🔍 搜索</h3>
            <input
              type="text"
              placeholder="搜索题目或答案..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {filteredBySearch && (
              <div className={styles.searchResults}>
                {filteredBySearch.length === 0 ? (
                  <div className={styles.emptyText}>无匹配结果</div>
                ) : (
                  filteredBySearch.map((c) => (
                    <div key={c.id} className={styles.searchItem}>
                      <div className={styles.searchQ}>{c.question.slice(0, 60)}...</div>
                      <div className={styles.searchMeta}>
                        {c.category} · 熟练度 {c.mastery}%
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>🎮 快捷键</h3>
            <div className={styles.shortcuts}>
              <div><kbd>Space</kbd> 翻转卡片</div>
              <div><kbd>←</kbd> <kbd>→</kbd> 切换题目</div>
              <div><kbd>1</kbd> 没掌握 <kbd>2</kbd> 基本了解 <kbd>3</kbd> 已掌握</div>
            </div>
          </div>

          <button className={styles.addBtn} onClick={() => setShowAddForm(!showAddForm)}>
            + 新建卡片
          </button>
        </div>

        {/* 右侧：主卡片区 */}
        <div className={styles.mainArea}>
          {showAddForm && (
            <div className={styles.addForm}>
              <h3>新建闪卡</h3>
              <input
                type="text"
                placeholder="分类（如：技术基础/数据结构）"
                value={newCard.category}
                onChange={(e) => setNewCard({ ...newCard, category: e.target.value })}
              />
              <textarea
                placeholder="问题"
                rows={3}
                value={newCard.question}
                onChange={(e) => setNewCard({ ...newCard, question: e.target.value })}
              />
              <textarea
                placeholder="答案"
                rows={4}
                value={newCard.answer}
                onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
              />
              <div className={styles.inlineRow}>
                <select
                  value={newCard.difficulty}
                  onChange={(e) => setNewCard({ ...newCard, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                >
                  <option value="easy">简单</option>
                  <option value="medium">中等</option>
                  <option value="hard">困难</option>
                </select>
              </div>
              <div className={styles.inlineRow}>
                <input
                  type="text"
                  placeholder="添加提示"
                  value={hintInput}
                  onChange={(e) => setHintInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && hintInput.trim()) {
                      setNewCard({ ...newCard, hints: [...(newCard.hints || []), hintInput.trim()] });
                      setHintInput('');
                    }
                  }}
                />
                <button className={styles.smallBtn} onClick={() => {
                  if (hintInput.trim()) {
                    setNewCard({ ...newCard, hints: [...(newCard.hints || []), hintInput.trim()] });
                    setHintInput('');
                  }
                }}>+</button>
              </div>
              {(newCard.hints || []).length > 0 && (
                <div className={styles.tagList}>
                  {(newCard.hints || []).map((h, i) => (
                    <span key={i} className={styles.tag}>
                      {h}
                      <button onClick={() => setNewCard({ ...newCard, hints: (newCard.hints || []).filter((_, j) => j !== i) })}>×</button>
                    </span>
                  ))}
                </div>
              )}
              <div className={styles.actions}>
                <button className={styles.primaryBtn} onClick={handleAddCard}>保存</button>
                <button className={styles.cancelBtn} onClick={() => setShowAddForm(false)}>取消</button>
              </div>
            </div>
          )}

          {currentCard ? (
            <FlashCardView
              card={currentCard}
              flipped={isFlipped}
              onFlip={flipCard}
              onRate={(rating) => rateCard(currentCard.id, rating)}
              onNext={nextCard}
              onPrev={prevCard}
              index={currentCardIndex}
              total={filteredCards.length}
            />
          ) : (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>📭</div>
              <p>{filterCategory ? '该分类下暂无题目' : '题库为空'}</p>
              <button className={styles.addBtn} onClick={() => setShowAddForm(true)}>+ 添加第一张卡片</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
