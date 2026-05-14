import { useUIStore } from './stores/uiStore';
import MainLayout from './components/layout/MainLayout';
import LearningPage from './pages/LearningPage';
import InterviewPage from './pages/InterviewPage';
import CareerPlanPage from './pages/CareerPlanPage';
import JobRadarPage from './pages/JobRadarPage';
import FinancePage from './pages/FinancePage';
import ProjectsPage from './pages/ProjectsPage';
import WarRoomPage from './pages/WarRoomPage';
import ProfilePage from './pages/ProfilePage';
import NetworkPage from './pages/NetworkPage';
import EnglishPage from './pages/EnglishPage';
import ProductThinkingPage from './pages/ProductThinkingPage';

const pageMap: Record<string, React.ReactNode> = {
  learning: <LearningPage />,
  interview: <InterviewPage />,
  'career-plan': <CareerPlanPage />,
  'job-radar': <JobRadarPage />,
  finance: <FinancePage />,
  projects: <ProjectsPage />,
  'war-room': <WarRoomPage />,
  profile: <ProfilePage />,
  network: <NetworkPage />,
  english: <EnglishPage />,
  'product-thinking': <ProductThinkingPage />,
};

// All 11 modules implemented — no more placeholders
export default function App() {
  const activeTab = useUIStore((s) => s.activeTab);

  return (
    <MainLayout>
      <div key={activeTab} className="animate-in" style={{ height: '100%' }}>
        {pageMap[activeTab] || pageMap.learning}
      </div>
    </MainLayout>
  );
}
