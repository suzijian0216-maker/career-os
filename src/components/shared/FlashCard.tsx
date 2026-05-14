import { useState, useCallback, useEffect } from 'react';
import type { FlashCard as FlashCardType } from '../../types';
import styles from './FlashCard.module.css';

interface FlashCardProps {
  card: FlashCardType;
  flipped: boolean;
  onFlip: () => void;
  onRate: (rating: number) => void;
  onNext: () => void;
  onPrev: () => void;
  index: number;
  total: number;
}

export default function FlashCardView({
  card,
  flipped,
  onFlip,
  onRate,
  onNext,
  onPrev,
  index,
  total,
}: FlashCardProps) {
  const [showHints, setShowHints] = useState(false);

  // 键盘快捷键
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onFlip();
    } else if (e.key === 'ArrowRight') {
      onNext();
    } else if (e.key === 'ArrowLeft') {
      onPrev();
    } else if (e.key === '1') onRate(-10);
    else if (e.key === '2') onRate(0);
    else if (e.key === '3') onRate(10);
  }, [onFlip, onNext, onPrev, onRate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const diffLabel = { easy: '简单', medium: '中等', hard: '困难' };
  const diffColor = { easy: 'var(--accent2)', medium: 'var(--warning)', hard: 'var(--danger)' };

  return (
    <div className={styles.card} onClick={onFlip}>
      <div className={styles.meta}>
        <span className={styles.category}>{card.category}</span>
        <span className={styles.diff} style={{ color: diffColor[card.difficulty] }}>
          {diffLabel[card.difficulty]}
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.question}>
          <span className={styles.qLabel}>Q</span>
          {card.question}
        </div>

        {flipped && (
          <div className={`${styles.answer} animate-in`}>
            <span className={styles.aLabel}>A</span>
            <div>{card.answer}</div>

            {card.hints.length > 0 && (
              <div className={styles.hints}>
                <button
                  className={styles.hintBtn}
                  onClick={(e) => { e.stopPropagation(); setShowHints(!showHints); }}
                >
                  {showHints ? '隐藏提示' : '💡 显示提示'}
                </button>
                {showHints && (
                  <ul>
                    {card.hints.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                )}
              </div>
            )}

            {card.followUps.length > 0 && (
              <div className={styles.followups}>
                <strong>追问链：</strong>
                <ul>
                  {card.followUps.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.nav}>
          <button onClick={(e) => { e.stopPropagation(); onPrev(); }}>← 上一题</button>
          <span className={styles.counter}>{index + 1} / {total}</span>
          <button onClick={(e) => { e.stopPropagation(); onNext(); }}>下一题 →</button>
        </div>
        <div className={styles.prompt}>
          {flipped ? '点击卡片翻转 · 按 1/2/3 评分' : '点击卡片显示答案 · 空格键翻转'}
        </div>
      </div>

      {flipped && (
        <div className={styles.rating}>
          <span>掌握程度：</span>
          <button className={styles.rateBtn} onClick={(e) => { e.stopPropagation(); onRate(-15); }}>
            😰 没掌握
          </button>
          <button className={styles.rateBtn} onClick={(e) => { e.stopPropagation(); onRate(0); }}>
            🤔 基本了解
          </button>
          <button className={styles.rateBtn} onClick={(e) => { e.stopPropagation(); onRate(15); }}>
            💪 已掌握
          </button>
          <div className={styles.masteryBar}>
            <div className={styles.masteryFill} style={{ width: `${card.mastery}%` }} />
          </div>
          <span className={styles.masteryText}>熟练度 {card.mastery}%</span>
        </div>
      )}
    </div>
  );
}
