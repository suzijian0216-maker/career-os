import { useUIStore } from '../../stores/uiStore';
import { useSkillStore } from '../../stores/skillStore';
import styles from './StatusBar.module.css';

export default function StatusBar() {
  const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useUIStore();
  const daysSinceStart = useSkillStore((s) => s.getDaysSinceStart());
  const totalLC = useSkillStore((s) => s.getTotalLeetCode());
  const totalPom = useSkillStore((s) => s.getTotalPomodoroMinutes());
  const progress = useSkillStore((s) => s.getOverallProgress());

  return (
    <footer className={styles.bar}>
      <button className={styles.item} onClick={toggleSidebar} title="切换侧栏">
        ☰
      </button>
      <span className={styles.sep}>|</span>
      <span className={styles.item}>🟢 Career OS v2.0</span>
      <span className={styles.sep}>|</span>
      <button className={`${styles.item} ${styles.modeBtn}`} onClick={toggleTheme} title="切换主题">
        {theme === 'geek' ? '<Geek />' : '<Finance />'}
      </button>
      <span className={styles.sep}>|</span>
      <span className={styles.item}>📅 第 {daysSinceStart} 天</span>
      <span className={styles.item}>💻 {totalLC} 题</span>
      <span className={styles.item}>⏱️ {Math.floor(totalPom / 60)}h {totalPom % 60}m</span>
      <span className={styles.item}>📊 总进度 {progress}%</span>

      <span style={{ marginLeft: 'auto' }} />
      <span className={styles.item}>UTF-8</span>
      <span className={styles.sep}>|</span>
      <span className={styles.item}>TypeScript</span>
    </footer>
  );
}
