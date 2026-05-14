import { useEffect } from 'react';
import Sidebar from './Sidebar';
import TabBar from './TabBar';
import StatusBar from './StatusBar';
import { useUIStore } from '../../stores/uiStore';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  // 同步初始主题到 DOM
  useEffect(() => {
    const theme = useUIStore.getState().theme;
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const handleNavigate = (id: string) => {
    const labelMap: Record<string, string> = {
      learning: '技能锻造台',
      interview: '面试演武场',
      'career-plan': '路径模拟器',
      'job-radar': '机会雷达',
      profile: '个人简介',
      finance: '生存账本',
      projects: '作品陈列馆',
      english: '英语 Cockpit',
      network: '关系星图',
      'product-thinking': '产品思维角',
      'war-room': '作战室',
    };
    const iconMap: Record<string, string> = {
      learning: '🔧', interview: '🎯', 'career-plan': '🗺️', 'job-radar': '📡',
      profile: '👤', finance: '💰', projects: '🖼️', english: '🇬🇧',
      network: '🌟', 'product-thinking': '💡', 'war-room': '⚔️',
    };
    useUIStore.getState().openTab({
      id,
      label: labelMap[id] || id,
      icon: iconMap[id] || '📄',
      active: true,
    });
  };

  return (
    <div className={styles.container}>
      <Sidebar onNavigate={handleNavigate} />
      <div className={styles.main}>
        <TabBar />
        <div className={styles.content}>
          {children}
        </div>
        <StatusBar />
      </div>
    </div>
  );
}
