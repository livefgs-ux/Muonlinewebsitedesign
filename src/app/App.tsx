import { useState, lazy, Suspense, useEffect } from 'react';
import { Navigation } from './components/navigation';
import { ServerInfoWidget } from './components/server-info-widget';
import { MusicProvider } from './contexts/music-context';
import { MusicPlayerWidget } from './components/music-player-widget';
import { LanguageProvider } from './contexts/LanguageContext';
import { LanguageSelector } from './components/language-selector';
import { NewsProvider } from './contexts/NewsContext';
import { SharedBackground } from './components/shared-background';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PlayerProvider } from './contexts/PlayerContext';

// Lazy loading de componentes pesados
const HeroSection = lazy(() => import('./components/hero-section').then(m => ({ default: m.HeroSection })));
const DashboardSection = lazy(() => import('./components/dashboard-section').then(m => ({ default: m.DashboardSection })));
const EventsSection = lazy(() => import('./components/events-section').then(m => ({ default: m.EventsSection })));
const RankingsSection = lazy(() => import('./components/rankings-section').then(m => ({ default: m.RankingsSection })));
const DownloadsSection = lazy(() => import('./components/downloads-section').then(m => ({ default: m.DownloadsSection })));
const NewsSection = lazy(() => import('./components/news-section').then(m => ({ default: m.NewsSection })));
const LoginSection = lazy(() => import('./components/login-section').then(m => ({ default: m.LoginSection })));
const PlayerDashboard = lazy(() => import('./components/player-dashboard').then(m => ({ default: m.PlayerDashboard })));
const AdminLogin = lazy(() => import('./components/admin-login').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./components/admin-dashboard').then(m => ({ default: m.AdminDashboard })));

// Skeleton loader component
const SectionLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-amber-400/80">Carregando...</p>
    </div>
  </div>
);

/**
 * MeuMU Online - Main Application
 * Season 19-2-3 - Épico
 * ⚡ OTIMIZADO para performance
 */

function AppContent() {
  const [currentSection, setCurrentSection] = useState('home');
  const { isLoggedIn, user } = useAuth();
  const isAdmin = user?.isAdmin || false;
  
  // Estado separado para AdminCP
  const [adminSession, setAdminSession] = useState<any>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleLoginSuccess = () => {
    setCurrentSection('dashboard');
  };

  const handleLogout = () => {
    setCurrentSection('home');
  };
  
  const handleAdminLoginSuccess = (adminData: any) => {
    setAdminSession(adminData);
    setShowAdminPanel(true);
  };
  
  const handleAdminLogout = () => {
    setAdminSession(null);
    setShowAdminPanel(false);
    sessionStorage.removeItem('adminSession');
  };
  
  // 🛡️ Verificar sessão admin ao carregar
  useEffect(() => {
    const savedSession = sessionStorage.getItem('adminSession');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setAdminSession(parsed);
        setShowAdminPanel(true);
      } catch (error) {
        console.error('Erro ao carregar sessão admin:', error);
      }
    }
  }, []);
  
  // Se AdminCP estiver ativo, mostrar dashboard admin
  if (showAdminPanel && adminSession) {
    return (
      <Suspense fallback={<SectionLoader />}>
        <AdminDashboard adminData={adminSession} onLogout={handleAdminLogout} />
      </Suspense>
    );
  }

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return <HeroSection onNavigate={setCurrentSection} />;
      case 'dashboard':
        return isLoggedIn ? (
          <PlayerDashboard onLogout={handleLogout} />
        ) : (
          <LoginSection onLoginSuccess={handleLoginSuccess} />
        );
      case 'events':
        return <EventsSection />;
      case 'rankings':
        return <RankingsSection />;
      case 'downloads':
        return <DownloadsSection />;
      case 'news':
        return <NewsSection />;
      case 'admin':
        return <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />;
      default:
        return <HeroSection onNavigate={setCurrentSection} />;
    }
  };

  return (
    <>
      {/* ⚠️ BACKGROUND UNIVERSAL - NUNCA REMOVER! ⚠️ */}
      <SharedBackground />
      
      <div className="min-h-screen relative">
        <Navigation 
          onNavigate={setCurrentSection} 
          currentSection={currentSection}
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          onLogout={handleLogout}
        />
        
        {/* Language Selector - Fixed top right above widgets */}
        <div className="fixed top-24 right-6 z-40">
          <LanguageSelector />
        </div>
        
        <Suspense fallback={<SectionLoader />}>
          {renderSection()}
        </Suspense>
        
        <ServerInfoWidget currentSection={currentSection} />
        <MusicPlayerWidget currentSection={currentSection} />
      </div>
    </>
  );
}

export default function App() {
  // IMPORTANT: All providers wrap the entire app to ensure hooks work correctly
  return (
    <LanguageProvider>
      <NewsProvider>
        <MusicProvider>
          <AuthProvider>
            <PlayerProvider>
              <AppContent />
            </PlayerProvider>
          </AuthProvider>
        </MusicProvider>
      </NewsProvider>
    </LanguageProvider>
  );
}