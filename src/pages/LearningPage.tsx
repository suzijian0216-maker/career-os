import { useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';

import { useSkillStore } from '../stores/skillStore';
import { useUIStore } from '../stores/uiStore';
import ProgressBar from '../components/shared/ProgressBar';
import type { LeetCodeRecord, PomodoroSession } from '../types';
import styles from './LearningPage.module.css';

const stageLabels: Record<string, string> = {
  outsider: '门外汉',
  beginner: '入门者',
  practitioner: '实践者',
  proficient: '熟练者',
  master: '掌握者',
};

export default function LearningPage() {
  const {
    roadmap, skills, leetCode, pomodoro,
    toggleTask, setSkillLevel,
    addLeetCodeRecord, addPomodoro,
    getDaysSinceStart, getTotalLeetCode, getTotalPomodoroMinutes, getOverallProgress,
  } = useSkillStore();

  const theme = useUIStore((s) => s.theme);
  const isDark = theme === 'finance';

  const [lcInput, setLcInput] = useState({ date: new Date().toISOString().slice(0, 10), easy: 0, medium: 0, hard: 0 });
  const [pomInput, setPomInput] = useState({ subject: '', duration: 25 });

  // --- 雷达图配置 ---
  const radarOption = useMemo(() => {
    const textColor = isDark ? '#8b949e' : '#6b7280';
    const splitColor = isDark ? '#1c2333' : '#e5e7eb';
    return {
      radar: {
        center: ['50%', '55%'],
        radius: '70%',
        indicator: skills.map((s) => ({ name: s.name, max: 100 })),
        axisName: { color: textColor, fontSize: 10 },
        splitLine: { lineStyle: { color: splitColor } },
        axisLine: { lineStyle: { color: splitColor } },
      },
      series: [{
        type: 'radar',
        data: [{
          value: skills.map((s) => s.level),
          name: '当前水平',
          areaStyle: { color: isDark ? 'rgba(240,185,11,0.2)' : 'rgba(37,99,235,0.15)' },
          lineStyle: { color: isDark ? '#f0b90b' : '#2563eb', width: 2 },
          itemStyle: { color: isDark ? '#f0b90b' : '#2563eb' },
          symbol: 'circle', symbolSize: 5,
        }],
      }],
    };
  }, [skills, isDark]);

  // --- Stats ---
  const days = getDaysSinceStart();
  const totalLC = getTotalLeetCode();
  const totalPomMin = getTotalPomodoroMinutes();
  const progress = getOverallProgress();

  // --- Kanban tasks ---
  const todoTasks = roadmap.flatMap((p) => p.tasks.filter((t) => !t.done).map((t) => ({ ...t, phase: p.name, phaseId: p.id })));
  const doneTasks = roadmap.flatMap((p) => p.tasks.filter((t) => t.done).map((t) => ({ ...t, phase: p.name, phaseId: p.id })));
  const inProgressTasks = todoTasks.slice(0, 3); // 前3个待办作为进行中

  return (
    <div className={styles.page}>
      {/* 顶部统计 */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{days}</div>
          <div className={styles.statLabel}>学习天数</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalLC}</div>
          <div className={styles.statLabel}>LeetCode 刷题</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{Math.floor(totalPomMin / 60)}h {totalPomMin % 60}m</div>
          <div className={styles.statLabel}>学习时长</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{progress}%</div>
          <div className={styles.statLabel}>总进度</div>
        </div>
      </div>

      <div className={styles.grid}>
        {/* 左列：路线图 */}
        <div className={styles.mainCol}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>学习路线图</h3>
            <ProgressBar value={progress} label="总进度" />

            <div className={styles.roadmap}>
              {roadmap.map((phase) => {
                const doneCount = phase.tasks.filter((t) => t.done).length;
                const phaseProgress = Math.round((doneCount / phase.tasks.length) * 100);
                const statusColors = {
                  done: 'var(--node-done)',
                  active: 'var(--node-active)',
                  future: 'var(--node-future)',
                };
                return (
                  <details key={phase.id} className={styles.phase} open={phase.status !== 'future'}>
                    <summary className={styles.phaseHeader}>
                      <span className={styles.phaseDot} style={{ background: statusColors[phase.status] }} />
                      <span className={styles.phaseName}>{phase.name}</span>
                      <span className={styles.phasePeriod}>{phase.period}</span>
                      <span className={styles.phaseCount}>{doneCount}/{phase.tasks.length}</span>
                    </summary>
                    <div className={styles.phaseTasks}>
                      {phase.tasks.map((task) => (
                        <label key={task.id} className={`${styles.taskItem} ${task.done ? styles.taskDone : ''}`}>
                          <input
                            type="checkbox"
                            checked={task.done}
                            onChange={() => toggleTask(phase.id, task.id)}
                          />
                          <div>
                            <span className={styles.taskContent}>{task.content}</span>
                            <span className={styles.taskMeta}>
                              {task.month}
                              {task.resources.length > 0 && ` · ${task.resources[0]}`}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        </div>

        {/* 右列：雷达图 + 技能 */}
        <div className={styles.sideCol}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>技能雷达</h3>
            <div style={{ height: 280 }}>
              <ReactECharts
                option={radarOption}
                style={{ height: '100%' }}
                notMerge
                lazyUpdate
              />
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>技能熟练度</h3>
            {skills.map((skill) => (
              <div key={skill.id} className={styles.skillRow}>
                <div className={styles.skillInfo}>
                  <span className={styles.skillName}>{skill.name}</span>
                  <span className={styles.skillStage}>{stageLabels[skill.stage]}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={skill.level}
                  onChange={(e) => setSkillLevel(skill.id, Number(e.target.value))}
                  className={styles.skillSlider}
                />
                <span className={styles.skillLevel}>{skill.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban 三列 */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>任务看板</h3>
        <div className={styles.kanban}>
          <div className={styles.kanbanCol}>
            <div className={styles.kanbanHeader} style={{ background: 'var(--border)' }}>📋 待学 ({todoTasks.length})</div>
            {todoTasks.slice(3).map((t) => (
              <div key={t.id} className={styles.kanbanCard}>
                <input type="checkbox" onChange={() => toggleTask(t.phaseId, t.id)} />
                <div>
                  <div className={styles.kanbanTitle}>{t.content}</div>
                  <div className={styles.kanbanMeta}>{t.phase} · {t.month}</div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.kanbanCol}>
            <div className={styles.kanbanHeader} style={{ background: 'var(--accent)', color: '#fff' }}>🔄 进行中 ({inProgressTasks.length})</div>
            {inProgressTasks.map((t) => (
              <div key={t.id} className={styles.kanbanCard}>
                <input type="checkbox" onChange={() => toggleTask(t.phaseId, t.id)} />
                <div>
                  <div className={styles.kanbanTitle}>{t.content}</div>
                  <div className={styles.kanbanMeta}>{t.phase} · {t.month}</div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.kanbanCol}>
            <div className={styles.kanbanHeader} style={{ background: 'var(--accent2)', color: '#fff' }}>✅ 已掌握 ({doneTasks.length})</div>
            {doneTasks.slice(0, 10).map((t) => (
              <div key={t.id} className={`${styles.kanbanCard} ${styles.kanbanDone}`}>
                <div>
                  <div className={styles.kanbanTitle}>✓ {t.content}</div>
                  <div className={styles.kanbanMeta}>{t.phase}</div>
                </div>
              </div>
            ))}
            {doneTasks.length === 0 && <div className={styles.kanbanEmpty}>还没有完成任务，开始第一个吧 🚀</div>}
          </div>
        </div>
      </div>

      {/* 快捷记录区 */}
      <div className={styles.grid}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>📝 今日刷题记录</h3>
          <div className={styles.quickForm}>
            <input type="date" value={lcInput.date} onChange={(e) => setLcInput({ ...lcInput, date: e.target.value })} />
            <input type="number" placeholder="简单" min={0} value={lcInput.easy || ''} onChange={(e) => setLcInput({ ...lcInput, easy: Number(e.target.value) })} />
            <input type="number" placeholder="中等" min={0} value={lcInput.medium || ''} onChange={(e) => setLcInput({ ...lcInput, medium: Number(e.target.value) })} />
            <input type="number" placeholder="困难" min={0} value={lcInput.hard || ''} onChange={(e) => setLcInput({ ...lcInput, hard: Number(e.target.value) })} />
            <button
              className={styles.btn}
              onClick={() => {
                if (lcInput.easy + lcInput.medium + lcInput.hard === 0) return;
                addLeetCodeRecord(lcInput as LeetCodeRecord);
                setLcInput({ date: new Date().toISOString().slice(0, 10), easy: 0, medium: 0, hard: 0 });
              }}
            >
              + 记录
            </button>
          </div>
          {leetCode.length > 0 && (
            <div className={styles.recordList}>
              {leetCode.slice(-7).reverse().map((r, i) => (
                <div key={i} className={styles.recordItem}>
                  <span>{r.date}</span>
                  <span>🟢{r.easy} 🟡{r.medium} 🔴{r.hard}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>⏱️ 番茄钟记录</h3>
          <div className={styles.quickForm}>
            <input type="text" placeholder="学习内容" value={pomInput.subject} onChange={(e) => setPomInput({ ...pomInput, subject: e.target.value })} />
            <input type="number" placeholder="分钟" min={1} max={180} value={pomInput.duration} onChange={(e) => setPomInput({ ...pomInput, duration: Number(e.target.value) })} />
            <button
              className={styles.btn}
              onClick={() => {
                if (!pomInput.subject.trim() || pomInput.duration <= 0) return;
                addPomodoro({ date: new Date().toISOString().slice(0, 10), duration: pomInput.duration, subject: pomInput.subject });
                setPomInput({ subject: '', duration: 25 });
              }}
            >
              + 记录
            </button>
          </div>
          {pomodoro.length > 0 && (
            <div className={styles.recordList}>
              {pomodoro.slice(-7).reverse().map((p, i) => (
                <div key={i} className={styles.recordItem}>
                  <span>{p.date}</span>
                  <span>{p.subject} · {p.duration}min</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
