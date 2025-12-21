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
import { Footer } from './components/footer';

// Lazy loading de componentes pesados
const HeroSection = lazy(() => import('./components/hero-section'));
const DashboardSection = lazy(() => import('./components/dashboard-section'));
const EventsSection = lazy(() => import('./components/events-section-real')); // ✅ USANDO API REAL
const RankingsSection = lazy(() => import('./components/rankings-section-real')); // ✅ USANDO API REAL
const DownloadsSection = lazy(() => import('./components/downloads-section'));
const NewsSection = lazy(() => import('./components/news-section'));
const LoginSection = lazy(() => import('./components/login-section'));
const PlayerDashboard = lazy(() => import('./components/player-dashboard'));
const AdminLogin = lazy(() => import('./components/admin-login'));
const AdminDashboard = lazy(() => import('./components/admin-dashboard'));

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
        <AdminDashboard 
          adminData={adminSession} 
          onLogout={handleAdminLogout} 
          onNavigate={(section) => {
            // Fechar AdminCP e navegar para a seção solicitada
            setShowAdminPanel(false);
            setAdminSession(null);
            setCurrentSection(section);
          }}
        />
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
      
      <div className="min-h-screen relative flex flex-col">
        <Navigation 
          onNavigate={setCurrentSection} 
          currentSection={currentSection}
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          onLogout={handleLogout}
        />
        
        {/* Language Selector - Fixed top right */}
        <div className="fixed top-4 right-6 z-[110]">
          <LanguageSelector />
        </div>
        
        <div className="flex-1">
          <Suspense fallback={<SectionLoader />}>
            {renderSection()}
          </Suspense>
        </div>
        
        <Footer />
        
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