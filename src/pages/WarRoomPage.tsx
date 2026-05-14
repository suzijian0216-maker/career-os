import { useState, useEffect } from 'react';
import { useWarRoomStore } from '../stores/warRoomStore';
import { useSkillStore } from '../stores/skillStore';
import { useInterviewStore } from '../stores/interviewStore';
import { useProjectStore } from '../stores/projectStore';
import styles from './WarRoomPage.module.css';

export default function WarRoomPage() {
  const { todos, countdowns, achievements, addTodo, toggleTodo, removeTodo, getDaysUntil } = useWarRoomStore();
  const { getTotalLeetCode, getDaysSinceStart, getTotalPomodoroMinutes } = useSkillStore();
  const { sessions } = useInterviewStore();
  const { projects } = useProjectStore();
  const [todoInput, setTodoInput] = useState('');
  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  // 倒计时数据
  const countdownData = countdowns.map((c) => ({
    ...c,
    daysLeft: getDaysUntil(c.targetDate),
  }));

  // 检查成就
  useEffect(() => {
    const python = useSkillStore.getState().skills.find((s) => s.id === 'sk-py')?.level || 0;
    const ml = useSkillStore.getState().skills.find((s) => s.id === 'sk-ml')?.level || 0;
    const llm = useSkillStore.getState().skills.find((s) => s.id === 'sk-llm')?.level || 0;
    const newAchs = useWarRoomStore.getState().checkAchievements({
      lc: getTotalLeetCode(),
      days: getDaysSinceStart(),
      minutes: getTotalPomodoroMinutes(),
      mockCount: sessions.length,
      python,
      ml,
      llm,
      hasProject: projects.some((p) => p.status === 'done'),
    });
    if (newAchs.length > 0) {
      setNewAchievements(newAchs.map((a) => a.name));
      setTimeout(() => setNewAchievements([]), 5000);
    }
  }, []);

  const todayTodos = todos.filter((t) => !t.done);
  const doneTodos = todos.filter((t) => t.done);

  return (
    <div className={styles.page}>
      {/* 成就弹窗 */}
      {newAchievements.length > 0 && (
        <div className={styles.achieveToast}>
          {newAchievements.map((name, i) => (
            <div key={i} className={styles.achieveItem}>🎉 解锁成就：{name}</div>
          ))}
        </div>
      )}

      {/* 倒计时 */}
      <div className={styles.countdownRow}>
        {countdownData.map((c) => (
          <div key={c.id} className={styles.countdown} style={{ borderTop: `3px solid ${c.color}` }}>
            <div className={styles.cdName}>{c.name}</div>
            <div className={styles.cdDays} style={{ color: c.color }}>
              {c.daysLeft > 0 ? c.daysLeft : c.daysLeft === 0 ? '今天！' : `${Math.abs(c.daysLeft)} 天前`}
            </div>
            <div className={styles.cdLabel}>{c.daysLeft > 0 ? '天后' : ''}</div>
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        {/* 每日必做 */}
        <div className={styles.section}>
          <h3 className={styles.title}>📋 今日必做</h3>
          <div className={styles.todoInput}>
            <input
              placeholder="添加任务..."
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && todoInput.trim()) {
                  addTodo(todoInput.trim());
                  setTodoInput('');
                }
              }}
            />
            <button onClick={() => { if (todoInput.trim()) { addTodo(todoInput.trim()); setTodoInput(''); } }}>+</button>
          </div>
          <div className={styles.todoList}>
            {todayTodos.map((t) => (
              <label key={t.id} className={`${styles.todoItem} ${t.done ? styles.todoDone : ''}`}>
                <input type="checkbox" checked={t.done} onChange={() => toggleTodo(t.id)} />
                <span>{t.content}</span>
                <button className={styles.todoDel} onClick={(e) => { e.stopPropagation(); removeTodo(t.id); }}>×</button>
              </label>
            ))}
            {doneTodos.length > 0 && (
              <details className={styles.doneGroup}>
                <summary>已完成 ({doneTodos.length})</summary>
                {doneTodos.map((t) => (
                  <label key={t.id} className={`${styles.todoItem} ${styles.todoDone}`}>
                    <input type="checkbox" checked={t.done} onChange={() => toggleTodo(t.id)} />
                    <span>{t.content}</span>
                  </label>
                ))}
              </details>
            )}
            {todayTodos.length === 0 && doneTodos.length === 0 && (
              <div className={styles.emptyText}>添加今天的第一个任务 🚀</div>
            )}
          </div>
        </div>

        {/* 成就墙 */}
        <div className={styles.section}>
          <h3 className={styles.title}>🏆 成就墙</h3>
          <div className={styles.achieveGrid}>
            {achievements.map((a) => (
              <div key={a.id} className={`${styles.achieveCard} ${a.unlockedAt ? styles.achieveUnlocked : styles.achieveLocked}`}>
                <div className={styles.achieveIcon}>{a.unlockedAt ? a.icon : '🔒'}</div>
                <div className={styles.achieveName}>{a.name}</div>
                <div className={styles.achieveDesc}>{a.description}</div>
                {a.unlockedAt && <div className={styles.achieveDate}>{a.unlockedAt}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 实时数据面板 */}
      <div className={styles.section}>
        <h3 className={styles.title}>📡 实时数据面板</h3>
        <div className={styles.dashGrid}>
          <div className={styles.dashCard}>
            <div className={styles.dashValue}>{getTotalLeetCode()}</div>
            <div className={styles.dashLabel}>总刷题数</div>
          </div>
          <div className={styles.dashCard}>
            <div className={styles.dashValue}>{getDaysSinceStart()}</div>
            <div className={styles.dashLabel}>学习天数</div>
          </div>
          <div className={styles.dashCard}>
            <div className={styles.dashValue}>{Math.floor(getTotalPomodoroMinutes() / 60)}h</div>
            <div className={styles.dashLabel}>总时长</div>
          </div>
          <div className={styles.dashCard}>
            <div className={styles.dashValue}>{sessions.length}</div>
            <div className={styles.dashLabel}>Mock 次数</div>
          </div>
          <div className={styles.dashCard}>
            <div className={styles.dashValue}>{projects.filter((p) => p.status === 'done').length}</div>
            <div className={styles.dashLabel}>已完成项目</div>
          </div>
          <div className={styles.dashCard}>
            <div className={styles.dashValue}>{achievements.filter((a) => a.unlockedAt).length}/{achievements.length}</div>
            <div className={styles.dashLabel}>成就解锁</div>
          </div>
        </div>
      </div>
    </div>
  );
}
