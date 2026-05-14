import { useUIStore } from '../../stores/uiStore';
import styles from './Sidebar.module.css';

const fileTree = [
  { id: 'profile', icon: '👤', label: '个人简介', type: 'file', children: null },
  { id: 'career-plan', icon: '🗺️', label: '路径模拟器', type: 'file', children: null },
  {
    id: 'learning-group', icon: '📁', label: '学习', type: 'folder', children: [
      { id: 'learning', icon: '🔧', label: '技能锻造台', type: 'file' },
      { id: 'english', icon: '🇬🇧', label: '英语 Cockpit', type: 'file' },
    ]
  },
  {
    id: 'job-group', icon: '📁', label: '求职', type: 'folder', children: [
      { id: 'job-radar', icon: '📡', label: '机会雷达', type: 'file' },
      { id: 'interview', icon: '🎯', label: '面试演武场', type: 'file' },
      { id: 'war-room', icon: '⚔️', label: '作战室', type: 'file' },
    ]
  },
  {
    id: 'asset-group', icon: '📁', label: '资产', type: 'folder', children: [
      { id: 'projects', icon: '🖼️', label: '作品陈列馆', type: 'file' },
      { id: 'finance', icon: '💰', label: '生存账本', type: 'file' },
    ]
  },
  {
    id: 'network-group', icon: '📁', label: '网络', type: 'folder', children: [
      { id: 'network', icon: '🌟', label: '关系星图', type: 'file' },
      { id: 'product-thinking', icon: '💡', label: '产品思维角', type: 'file' },
    ]
  },
];

interface SidebarProps {
  onNavigate: (id: string) => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const { sidebarOpen, activeTab } = useUIStore();

  if (!sidebarOpen) return null;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>CAREER OS</div>
      <div className={styles.tree}>
        {fileTree.map((item) =>
          item.children ? (
            <div key={item.id}>
              <div className={`${styles.item} ${styles.folder}`}>
                <span className={styles.icon}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.children.map((child) => (
                <button
                  key={child.id}
                  className={`${styles.item} ${styles.file} ${activeTab === child.id ? styles.active : ''} ${'disabled' in child && child.disabled ? styles.disabled : ''}`}
                  onClick={() => !child.disabled && onNavigate(child.id)}
                  disabled={'disabled' in child && child.disabled}
                >
                  <span className={styles.icon}>{child.icon}</span>
                  <span>{child.label}</span>
                  {'disabled' in child && child.disabled && <span className={styles.badge}>Soon</span>}
                </button>
              ))}
            </div>
          ) : (
            <button
              key={item.id}
              className={`${styles.item} ${activeTab === item.id ? styles.active : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          )
        )}
      </div>
    </aside>
  );
}
