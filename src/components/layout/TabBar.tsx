import { useUIStore } from '../../stores/uiStore';
import styles from './TabBar.module.css';

export default function TabBar() {
  const { tabs, activeTab, setActiveTab, closeTab } = useUIStore();

  return (
    <div className={styles.bar}>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`${styles.tab} ${tab.active ? styles.active : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
          <button
            className={styles.close}
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
            title="关闭"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
